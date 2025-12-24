import { BrandingConfig } from './branding.config';

export const Messages = {
  // Auth messages
  AUTH: {
    WELCOME_ADMIN: 'Benvingut de nou Admin',
    WELCOME_USER: 'Has iniciat sessió correctament.',
    WELCOME: 'Benvingut',
    LOGOUT_SUCCESS: 'Sessió tancada correctament',
  },

  // Validation messages
  VALIDATION: {
    REQUIRED_FIELDS: 'Tots els camps són obligatoris',
    INVALID_EMAIL: 'El correu electrònic no és vàlid.',
    GINEBRO_EMAIL_REQUIRED: `El correu ha de ser del domini ${BrandingConfig.EMAIL.DOMAIN}.`,
    PASSWORD_REQUIREMENTS: 'La contrasenya no compleix els requisits.',
    PASSWORDS_MISMATCH: 'Les contrasenyes no coincideixen.',
    VALID_EMAIL_REQUIRED: 'Introdueix un correu vàlid.',
    REVIEW_FORM_FIELDS: 'Revisa tots els camps del formulari.',
  },

  // Order messages
  ORDERS: {
    SELECT_MENU_TYPE: 'Selecciona un tipus de menú.',
    NO_PAST_ORDERS: 'No pots fer comandes per a avui ni dies anteriors.',
    SELECT_ALL_OPTIONS:
      'Si us plau, selecciona totes les opcions obligatòries del menú.',
    ORDER_SUCCESS: 'Comanda realitzada correctament.',
    ORDER_ERROR: 'Error al realitzar la comanda.',
    DUPLICATE_ORDER: "No pots realitzar més d'una comanda pel mateix dia.",
    DATE_AVAILABILITY_ERROR: 'Error al verificar la disponibilitat de la data.',
    STATUS_UPDATE_SUCCESS: 'Estat de la comanda modificada correctament.',
    STATUS_UPDATE_ERROR: "Error en actualitzar l'estat de la comanda.",
  },

  // Registration messages
  REGISTRATION: {
    CODE_SENT: 'Codi enviat al teu correu.',
    CODE_SEND_ERROR: "No s'ha pogut enviar el codi.",
    REGISTRATION_COMPLETE: 'Registre completat',
    REGISTRATION_WELCOME: 'Benvingut!',
    REGISTRATION_ERROR: 'Error de registre',
    REGISTRATION_REVIEW: 'Revisa les dades.',
    REGISTRATION_FAILED: "No s'ha pogut completar el registre.",
  },

  // Password reset messages
  PASSWORD_RESET: {
    CODE_SENT: 'Codi enviat al teu correu electrònic',
    CODE_SEND_ERROR: 'Error enviant el codi. Si us plau, torna-ho a intentar.',
    RESET_SUCCESS: 'Contrasenya restablerta correctament',
    RESET_ERROR:
      'Error al restablir la contrasenya. Si us plau, torna-ho a intentar més tard.',
  },

  // Import/Export messages
  IMPORT_EXPORT: {
    EXPORT_ERROR: "Error durant l'exportació de dades.",
    MENUS_IMPORT_SUCCESS: 'Menús importats correctament',
    MENUS_IMPORT_ERROR: 'Error durant la importació dels menús',
    USERS_IMPORT_SUCCESS: 'Usuaris importats correctament',
    USERS_IMPORT_ERROR: 'Error durant la importació dels usuaris',
    INVALID_JSON: 'El fitxer no és un JSON o CSV vàlid',
    SELECT_VALID_JSON: 'Has de seleccionar un fitxer JSON o CSV vàlid',
  },

  // User management messages
  USERS: {
    LOADING_ERROR: "Error carregant l'usuari complet",
    STATUS_CHANGE_SUCCESS: (isActive: boolean) =>
      `Usuari ${isActive ? 'desactivat' : 'activat'} correctament.`,
    STATUS_CHANGE_ERROR: "Error en modificar l'estat del usuari.",
    ALLERGIES_SAVED: 'Al·lèrgies guardades',
    ALLERGIES_SAVED_DESC:
      "Les teves al·lèrgies s'han actualitzat correctament.",
    ALLERGIES_ERROR: "No s'han pogut guardar les al·lèrgies.",
    PROTECTED_USER_ERROR:
      'No es pot desactivar aquest usuari (Admin, Cuina o Usuari Actual).',
    INSUFFICIENT_BALANCE: 'No tens prou saldo per fer aquesta comanda.',
  },

  // Configuration messages
  CONFIGURATION: {
    LOAD_ERROR: 'Error carregant la configuració',
    SAVE_SUCCESS: 'Configuració guardada correctament',
    SAVE_ERROR: 'Error guardant la configuració',
    IMAGES_LOAD_ERROR: 'Error carregant les imatges',
    IMAGE_UPLOAD_SUCCESS: 'Imatge pujada correctament',
    IMAGE_UPLOAD_ERROR: 'Error pujant la imatge',
    IMAGE_DELETE_CONFIRM: 'Estàs segur que vols eliminar aquesta imatge?',
    IMAGE_DELETE_SUCCESS: 'Imatge eliminada correctament',
    IMAGE_DELETE_ERROR: 'Error eliminant la imatge',
  },

  // Payment messages
  PAYMENT: {
    INITIATE_ERROR: "No s'ha pogut iniciar el pagament.",
    REDSYS_REDIRECT_ERROR: "No s'ha pogut redirigir a la passarel·la de pagament.",
    SERVER_CONNECTION_ERROR: "No s'ha pogut connectar amb el servidor.",
  },

  // Generic messages
  GENERIC: {
    ERROR: 'Error',
  },
};
