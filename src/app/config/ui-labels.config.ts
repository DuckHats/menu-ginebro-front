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
    TAPER_SUBTITLE: 'Portaré el meu propi',
    SELECT_DAY: 'Selecciona el dia',
    MENU_TYPE_TITLE: 'Tipus de menú',
    RESTRICTED_DATE_TITLE: 'Data no disponible',
    EMPTY_STATE: 'Tria un tipus de menú per començar a configurar la teva reserva',
    DOWNLOAD_BUTTON: 'Descarregar Menú',
    CONFIRM_BUTTON: 'Confirmar Selecció',
    TAPER_YES: 'Portaré Tàper',
    TAPER_NO: 'No portaré Tàper',
    CONFIRM: 'Confirmar'
  },

  // Modals
  MODALS: {
    INTRO: {
      TITLE: 'Benvingut/da al Menjador!',
      DESCRIPTION: 'Tria el teu menú diari de forma fàcil i ràpida. Recorda revisar les hores de tall i antelació per assegurar la teva comanda.',
      BUTTON: 'Començar ara'
    },
    CONFIRM: {
      TITLE: 'Confirmar comanda',
      DATE: 'Data',
      MENU_TYPE: 'Tipus de Menú',
      OPTIONS: 'Opcions triades',
      OWN_TUPPER: 'Amb tàper propi',
      SUBTOTAL: 'Preu menú',
      TUPPER_SURCHARGE: 'Suplement tàper',
      PRICE: 'Preu total',
      BALANCE: 'El teu saldo',
      REMAINING_BALANCE: 'Saldo restant',
      INSUFFICIENT_FUNDS: 'Saldo insuficient',
      RECHARGE: 'RECARREGAR SALDO',
      QUESTION_1: 'Estàs segur/a que vols confirmar aquesta selecció?',
      QUESTION_2: 'Ara pots tornar enrere per fer canvis però després no podràs modificar res.',
      BACK: 'Tornar enrere',
      CONFIRM: 'SÍ, CONFIRMAR'
    }
  }
};
