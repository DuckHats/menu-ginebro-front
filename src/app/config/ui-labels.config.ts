import { BrandingConfig } from './branding.config';

export const UILabels = {
  // Login Page
  LOGIN: {
    TITLE: 'Iniciar Sessió',
    SUBTITLE: 'Sistema de Menjador Escolar',
    EMAIL_LABEL: 'Correu electrònic',
    EMAIL_PLACEHOLDER: BrandingConfig.EMAIL.PLACEHOLDER,
    PASSWORD_LABEL: 'Contrasenya',
    PASSWORD_PLACEHOLDER: 'La teva contrasenya',
    SUBMIT_BUTTON: 'Iniciar Sessió',
    SUBMIT_BUTTON_LOADING: 'Iniciant sessió...',
    FORGOT_PASSWORD_LINK: 'Has oblidat la contrasenya?',
    REGISTER_LINK: 'No tens un compte?',
  },

  // Registration Page
  REGISTRATION: {
    TITLE: "Registre d'Estudiant",
    SUBTITLE: 'Sistema de Menjador Escolar',
    EMAIL_LABEL: 'Correu electrònic',
    EMAIL_PLACEHOLDER: 'el@teu.email',
    NAME_LABEL: 'Nom',
    NAME_PLACEHOLDER: 'El teu nom',
    LAST_NAME_LABEL: 'Cognoms',
    LAST_NAME_PLACEHOLDER: 'Els teus cognoms',
    VERIFICATION_CODE_LABEL: 'Codi de verificació',
    PASSWORD_LABEL: 'Contrasenya',
    PASSWORD_PLACEHOLDER: 'La teva contrasenya',
    PASSWORD_CONFIRMATION_LABEL: 'Confirma la Contrasenya',
    PASSWORD_CONFIRMATION_PLACEHOLDER: 'Introduïu la contrasenya de nou',
    SEND_CODE_BUTTON: 'Enviar codi',
    SEND_CODE_BUTTON_LOADING: 'Enviant...',
    COMPLETE_REGISTRATION_BUTTON: 'Completar registre',
    COMPLETE_REGISTRATION_BUTTON_LOADING: 'Registrant...',
    LOGIN_LINK: 'Ja tens compte? Inicia sessió',
    EMAIL_REQUIRED_ERROR: 'El correu és obligatori.',
    EMAIL_FORMAT_ERROR: 'Format de correu no vàlid.',
    EMAIL_DOMAIN_ERROR: 'Només es permeten correus ginebro.cat.',
    PASSWORDS_MISMATCH_ERROR: 'Les contrasenyes no coincideixen.',
  },

  // Forgot Password Page
  FORGOT_PASSWORD: {
    TITLE: 'Recuperar contrasenya',
    EMAIL_PLACEHOLDER: 'Introdueix el teu correu',
    NEW_PASSWORD_PLACEHOLDER: 'Nova contrasenya',
    REPEAT_PASSWORD_PLACEHOLDER: 'Repeteix la contrasenya',
  },

  // Common Form Labels
  COMMON: {
    SUBMIT: 'Enviar',
    CANCEL: 'Cancel·lar',
    SAVE: 'Guardar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    CLOSE: 'Tancar',
    CONFIRM: 'Confirmar',
    BACK: 'Tornar',
  },

  // History Page
  HISTORY: {
    TITLE: 'Historial de Comandes',
    BACK_TO_MENU: 'Tornar al menú',
    NO_ORDERS: 'No tens comandes a l\'historial.',
  },

  // Welcome Page
  WELCOME: {
    SELECT_MENU: 'Seleccionar Menú',
  },

  // Menu Selection Page
  MENU_SELECTION: {
    TITLE: 'Selecció de Menú',
    SUBTITLE: 'Tria els teus plats preferits per a cada dia',
    TAPER_LABEL: 'Opció de Tàper',
    CONFIRM_BUTTON: 'Confirmar Selecció',
    TAPER_YES: 'Portaré Tàper',
    TAPER_NO: 'No portaré Tàper',
    CONFIRM: 'Confirmar'
  },
};
