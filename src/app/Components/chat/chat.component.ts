import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild,
    inject
} from '@angular/core';

import {
    DatePipe,
    isPlatformBrowser
} from '@angular/common';

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { AdminUserId } from '../../enviroment.prod';
import { ChatService } from '../../Service/chat.service';
import { AuthService } from '../../Service/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DatePipe,
        TranslocoPipe
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent
    implements OnInit, OnChanges, AfterViewChecked {

    @ViewChild('chatWindow')
    chatWindow!: ElementRef<HTMLDivElement>;

    @Input()
    isOpen = false;

    @Output()
    unreadCountChange = new EventEmitter<number>();

    chatForm: FormGroup;

    message = '';

    /*
     * ID del administrador.
     * Debe ser exactamente igual al ID usado
     * en los mensajes enviados por los usuarios.
     */
    Admin: string = AdminUserId.userId;

    userId = '';
    chatId = '';

    currentName = '';
    currentEmail = '';
    currentLastName = '';
    currentAdmin = false;

    messages: any[] = [];
    selectedChat: any = null;
    chats: any[] = [];

    unreadCounts: {
        [chatId: string]: number
    } = {};

    unreadCount = 0;

    private platformId = inject(PLATFORM_ID);

    constructor(
        private authService: AuthService,
        private chatService: ChatService,
        private fb: FormBuilder
    ) {
        this.chatForm = this.fb.group({
            message: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        console.log('[CHAT] Componente iniciado');
        console.log('[CHAT] ID configurado del administrador:', this.Admin);

        this.authService.currentUser$
            .subscribe(user => {

                console.log('[CHAT] Usuario autenticado:', user);

                if (!user) {
                    console.log(
                        '[CHAT] No hay usuario autenticado'
                    );

                    this.userId = '';
                    this.chatId = '';

                    this.currentName = '';
                    this.currentEmail = '';
                    this.currentLastName = '';
                    this.currentAdmin = false;

                    this.messages = [];
                    this.chats = [];
                    this.selectedChat = null;
                    this.unreadCounts = {};

                    this.updateUnreadCount(0);

                    return;
                }

                this.userId = user.id;
                this.currentEmail = user.data.email;
                this.currentName = user.data.name;
                this.currentLastName = user.data.lastName;
                this.currentAdmin = user.data.IsAdmin;

                console.log('[CHAT] ID del usuario actual:', this.userId);
                console.log(
                    '[CHAT] ¿Es administrador?:',
                    this.currentAdmin
                );
                console.log(
                    '[CHAT] Comparación ID actual/admin:',
                    this.userId === this.Admin
                );

                this.messages = [];
                this.chats = [];
                this.selectedChat = null;
                this.unreadCounts = {};

                this.updateUnreadCount(0);

                /*
                 * USUARIO NORMAL
                 */
                if (!this.currentAdmin) {
                    this.chatId = this.userId;

                    console.log(
                        '[CHAT][USUARIO] Escuchando conversación:',
                        this.chatId
                    );

                    this.chatService
                        .getMessages(this.chatId)
                        .subscribe(messages => {
                            console.log(
                                '[CHAT][USUARIO] Mensajes recibidos:',
                                messages
                            );

                            this.messages = messages;

                            if (this.isOpen) {
                                this.markCurrentChatAsRead();
                            }
                        });

                    console.log(
                        '[CHAT][USUARIO] Buscando mensajes no leídos:',
                        {
                            chatId: this.chatId,
                            receiver: this.userId
                        }
                    );

                    this.chatService
                        .getUnReadMessages(
                            this.chatId,
                            this.userId
                        )
                        .subscribe(unreadMessages => {

                            console.log(
                                '[CHAT][USUARIO] Mensajes no leídos:',
                                unreadMessages
                            );

                            this.updateUnreadCount(
                                unreadMessages.length
                            );

                            if (
                                this.isOpen &&
                                unreadMessages.length > 0
                            ) {
                                this.markCurrentChatAsRead();
                            }
                        });
                }

                /*
                 * ADMINISTRADOR
                 */
                if (this.currentAdmin) {
                    console.log(
                        '[CHAT][ADMIN] Buscando conversaciones'
                    );

                    this.chatService
                        .getchats()
                        .subscribe(chats => {

                            console.log(
                                '[CHAT][ADMIN] Conversaciones encontradas:',
                                chats
                            );

                            this.chats = chats;

                            chats.forEach(chat => {
                                console.log(
                                    '[CHAT][ADMIN] Buscando mensajes no leídos:',
                                    {
                                        chatId: chat.id,
                                        receiver: this.Admin
                                    }
                                );

                                this.chatService
                                    .getUnReadMessages(
                                        chat.id,
                                        this.Admin
                                    )
                                    .subscribe(unreadMessages => {

                                        console.log(
                                            '[CHAT][ADMIN] Resultado de mensajes no leídos:',
                                            {
                                                chatId: chat.id,
                                                receiver: this.Admin,
                                                messages: unreadMessages
                                            }
                                        );

                                        this.unreadCounts[chat.id] =
                                            unreadMessages.length;

                                        this.updateAdminUnreadCount();

                                        if (
                                            this.isOpen &&
                                            this.selectedChat?.id === chat.id &&
                                            unreadMessages.length > 0
                                        ) {
                                            this.markChatAsRead(chat.id);
                                        }
                                    });
                            });
                        });
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const chatWasOpened =
            changes['isOpen']?.currentValue === true;

        console.log('[CHAT] Cambio en isOpen:', {
            isOpen: this.isOpen,
            chatWasOpened,
            chatId: this.chatId,
            userId: this.userId
        });

        if (
            chatWasOpened &&
            this.userId &&
            this.chatId
        ) {
            this.markCurrentChatAsRead();
        }
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    private updateUnreadCount(count: number): void {
        this.unreadCount = count;

        console.log(
            '[CHAT] Actualizando contador general:',
            count
        );

        this.unreadCountChange.emit(count);

        console.log(
            '[CHAT] Evento unreadCountChange emitido:',
            count
        );
    }

    private updateAdminUnreadCount(): void {
        const totalUnread = Object.values(this.unreadCounts)
            .reduce((total, count) => total + count, 0);

        console.log(
            '[CHAT][ADMIN] Contadores por conversación:',
            this.unreadCounts
        );

        console.log(
            '[CHAT][ADMIN] Total de mensajes no leídos:',
            totalUnread
        );

        this.updateUnreadCount(totalUnread);
    }

    private getCurrentReceiverId(): string {
        const receiverId = this.currentAdmin
            ? this.Admin
            : this.userId;

        console.log(
            '[CHAT] Destinatario utilizado para buscar mensajes:',
            receiverId
        );

        return receiverId;
    }

    private markCurrentChatAsRead(): void {
        if (!this.chatId || !this.userId) {
            console.log(
                '[CHAT] No se pueden marcar mensajes como leídos:',
                {
                    chatId: this.chatId,
                    userId: this.userId
                }
            );

            return;
        }

        this.markChatAsRead(this.chatId);
    }

    private markChatAsRead(chatId: string): void {
        const receiverId = this.getCurrentReceiverId();

        console.log(
            '[CHAT] Marcando mensajes como leídos:',
            {
                chatId,
                receiverId
            }
        );

        this.chatService
            .getUnReadMessages(chatId, receiverId)
            .subscribe(unreadMessages => {

                console.log(
                    '[CHAT] Mensajes encontrados para marcar como leídos:',
                    unreadMessages
                );

                if (unreadMessages.length === 0) {
                    return;
                }

                Promise.all(
                    unreadMessages.map(message => {
                        console.log(
                            '[CHAT] Marcando mensaje:',
                            message.id
                        );

                        return this.chatService
                            .markMessagesAsRead(
                                chatId,
                                message.id
                            );
                    })
                )
                    .then(() => {
                        console.log(
                            '[CHAT] Mensajes marcados como leídos'
                        );

                        if (this.currentAdmin) {
                            this.unreadCounts[chatId] = 0;
                            this.updateAdminUnreadCount();
                        } else {
                            this.updateUnreadCount(0);
                        }
                    })
                    .catch(error => {
                        console.error(
                            '[CHAT] Error al marcar mensajes como leídos:',
                            error
                        );
                    });
            });
    }

    private scrollToBottom(): void {
        if (!this.chatWindow) {
            return;
        }

        const element = this.chatWindow.nativeElement;
        element.scrollTop = element.scrollHeight;
    }

    async checkLogin(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const user = localStorage.getItem('user');

        if (user || this.userId) {
            return;
        }

        const bootstrap = (window as any).bootstrap;

        if (!bootstrap) {
            console.error(
                '[CHAT] Bootstrap no está disponible'
            );

            return;
        }

        const modalElement =
            document.getElementById('chatLoginModal');

        if (!modalElement) {
            console.error(
                '[CHAT] No se encontró #chatLoginModal'
            );

            return;
        }

        const modal =
            bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.show();
    }

    async selectChat(chat: any): Promise<void> {
        console.log(
            '[CHAT][ADMIN] Conversación seleccionada:',
            chat
        );

        this.selectedChat = chat;
        this.chatId = chat.id;

        this.chatService
            .getMessages(this.chatId)
            .subscribe(messages => {
                console.log(
                    '[CHAT][ADMIN] Mensajes de la conversación:',
                    messages
                );

                this.messages = messages;
            });

        this.markCurrentChatAsRead();
    }

    send(): void {
        console.log('[CHAT] Intentando enviar mensaje');

        if (!this.userId) {
            console.warn(
                '[CHAT] No hay usuario autenticado'
            );

            this.checkLogin();
            return;
        }

        if (this.chatForm.invalid) {
            console.warn(
                '[CHAT] El formulario es inválido'
            );

            this.chatForm.markAllAsTouched();
            return;
        }

        const text =
            this.chatForm.value.message?.trim();

        if (!text) {
            console.warn(
                '[CHAT] El mensaje está vacío'
            );

            return;
        }

        /*
         * USUARIO → ADMINISTRADOR
         */
        if (!this.currentAdmin) {
            this.chatId = this.userId;

            const messageData = {
                user: this.userId,
                received: this.Admin,
                text,
                createdAt: new Date(),
                read: false
            };

            console.log(
                '[CHAT][USUARIO] Enviando mensaje al administrador:',
                {
                    chatId: this.chatId,
                    sender: this.userId,
                    receiver: this.Admin,
                    message: messageData
                }
            );

            this.chatService
                .sendMessage(
                    this.chatId,
                    {
                        id: this.userId,
                        name: this.currentName,
                        lastName: this.currentLastName,
                        email: this.currentEmail,
                        IsAdmin: false
                    },
                    messageData
                )
                .then(() => {
                    console.log(
                        '[CHAT][USUARIO] Mensaje enviado correctamente'
                    );
                })
                .catch(error => {
                    console.error(
                        '[CHAT][USUARIO] Error al enviar mensaje:',
                        error
                    );
                });
        }

        /*
         * ADMINISTRADOR → USUARIO
         */
        if (this.currentAdmin) {
            const recipientId = this.selectedChat?.id;

            if (!recipientId) {
                console.error(
                    '[CHAT][ADMIN] No hay una conversación seleccionada'
                );

                return;
            }

            const messageData = {
                user: this.Admin,
                received: recipientId,
                text,
                createdAt: new Date(),
                read: false
            };

            console.log(
                '[CHAT][ADMIN] Enviando mensaje al usuario:',
                {
                    chatId: recipientId,
                    sender: this.Admin,
                    receiver: recipientId,
                    message: messageData
                }
            );

            this.chatService
                .sendMessage(
                    recipientId,
                    {
                        id: this.Admin,
                        name: this.currentName,
                        lastName: this.currentLastName,
                        email: this.currentEmail,
                        IsAdmin: true
                    },
                    messageData
                )
                .then(() => {
                    console.log(
                        '[CHAT][ADMIN] Mensaje enviado correctamente'
                    );
                })
                .catch(error => {
                    console.error(
                        '[CHAT][ADMIN] Error al enviar mensaje:',
                        error
                    );
                });
        }

        this.chatForm.reset();
    }
}
