export interface Repository {
    name:              string;
    link:              string;
    description:       string;
    descriptionTranslations?: Partial<Record<'es' | 'en' | 'pt' | 'fr' | 'it' | 'ja' | 'ru' | 'hi', string>>;
    skills:            string[];
    image:             string;
}
