export type Language = 'en' | 'es';

export interface TranslationKeys {
  // Common
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
    yes: string;
    no: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    send: string;
    submit: string;
    search: string;
    filter: string;
    clear: string;
    select: string;
    optional: string;
    required: string;
  };

  // Common UI elements
  dressCode: string;
  giftOptions: string;
  hotelInformation: string;
  loveQuote: string;
  specialInstructions: string;
  couplePhoto: string;
  photoGallery: string;

  // Navigation
  nav: {
    dashboard: string;
    weddings: string;
    guests: string;
    rsvp: string;
    gallery: string;
    settings: string;
    logout: string;
    login: string;
    register: string;
    profile: string;
  };

  // Authentication
  auth: {
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    loginTitle: string;
    registerTitle: string;
    forgotPassword: string;
    resetPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInWithGoogle: string;
    selectRole: string;
    admin: string;
    couple: string;
    guest: string;
  };

  // Wedding Creation/Management
  wedding: {
    createWedding: string;
    weddingDetails: string;
    brideFirstName: string;
    brideLastName: string;
    groomFirstName: string;
    groomLastName: string;
    weddingDate: string;
    ceremonyTime: string;
    ceremonyLocation: string;
    receptionTime: string;
    receptionLocation: string;
    subdomain: string;
    customizeInvitation: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    backgroundImage: string;
    welcomeMessage: string;
    loveQuote: string;
    dressCode: string;
    specialInstructions: string;
    allowPlusOnes: string;
    allowChildren: string;
    rsvpDeadline: string;
    emailNotifications: string;
    isPublic: string;
    templateStyle: string;
    classic: string;
    modern: string;
    rustic: string;
    elegant: string;
  };

  // Guest Management
  guests: {
    guestManagement: string;
    addGuest: string;
    editGuest: string;
    deleteGuest: string;
    importGuests: string;
    exportGuests: string;
    sendInvitations: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    category: string;
    inviteCode: string;
    rsvpStatus: string;
    confirmed: string;
    declined: string;
    pending: string;
    family: string;
    friends: string;
    work: string;
    other: string;
    totalGuests: string;
    confirmedGuests: string;
    pendingGuests: string;
    declinedGuests: string;
  };

  // RSVP
  rsvp: {
    rsvpTitle: string;
    rsvpMessage: string;
    willYouAttend: string;
    yesIWillAttend: string;
    sorryCannotAttend: string;
    guestName: string;
    dietaryRestrictions: string;
    specialRequests: string;
    plusOneAttending: string;
    plusOneName: string;
    childrenAttending: string;
    numberOfChildren: string;
    childrenNames: string;
    additionalComments: string;
    submitRSVP: string;
    rsvpConfirmed: string;
    rsvpDeclined: string;
    thankYouMessage: string;
    rsvpDeadlineMessage: string;
    alreadyResponded: string;
    invalidInviteCode: string;
    // Enhanced RSVP Form translations
    willYouBeAttending: string;
    yesIllBeThere: string;
    cantWaitToCelebrate: string;
    sorryCannotMakeIt: string;
    willBeThereInSpirit: string;
    maybe: string;
    stillFiguringOut: string;
    pleaseSelectAttendanceStatus: string;
    whichEventsWillYouAttend: string;
    weddingCeremony: string;
    weddingReception: string;
    plusOnes: string;
    maximum: string;
    plusOne: string;
    remove: string;
    firstName: string;
    lastName: string;
    firstNameRequired: string;
    lastNameRequired: string;
    enterFirstName: string;
    enterLastName: string;
    addGuest: string;
    dietaryRestrictionsOptional: string;
    anyDietaryRestrictions: string;
    songRequests: string;
    songRequestsPlaceholder: string;
    transportation: string;
    needTransportation: string;
    transportationDetails: string;
    provideTransportationDetails: string;
    accommodation: string;
    needAccommodation: string;
    accommodationDetails: string;
    provideAccommodationDetails: string;
    emergencyContact: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    contactPreference: string;
    email: string;
    phone: string;
    text: string;
    additionalMessage: string;
    shareSpecialMessage: string;
    submitting: string;
    submit: string;
    dietaryInfo: string;
    songInfo: string;
    contactPreferenceLabel: string;
    phoneCall: string;
    textMessage: string;
    emergencyContactOptional: string;
    enterName: string;
    enterPhoneNumber: string;
    // Special requests and messages
    specialRequestsTitle: string;
    specialRequestsLabel: string;
    specialRequestsPlaceholder: string;
    heartfeltMessage: string;
  };

  // Wedding Party
  weddingParty: {
    weddingParty: string;
    bridesmaids: string;
    groomsmen: string;
    maidOfHonor: string;
    bestMan: string;
    addMember: string;
    editMember: string;
    deleteMember: string;
    memberName: string;
    memberRole: string;
    memberPhoto: string;
    memberDescription: string;
    // Additional role translations
    ourWeddingParty: string;
    loadingWeddingParty: string;
    flowerGirls: string;
    ringBearers: string;
    officiant: string;
    padrinosVelacion: string;
    padrinosAnillos: string;
    padrinosArras: string;
    padrinosLazo: string;
    padrinosBiblia: string;
    padrinosCojines: string;
    padrinosRamo: string;
    other: string;
    bridesParty: string;
    groomsParty: string;
  };

  // Public Invitation
  invitation: {
    weAreGettingMarried: string;
    joinUsForOurWedding: string;
    ceremony: string;
    reception: string;
    viewOnMap: string;
    rsvpNow: string;
    ourStory: string;
    photoGallery: string;
    giftRegistry: string;
    dressCodeTitle: string;
    importantInformation: string;
    hotelAccommodations: string;
    questions: string;
    contactUs: string;
    lookingForward: string;
    withLove: string;
    saveTheDate: string;
    weddingOf: string;
    and: string;
    at: string;
    on: string;
    time: string;
    location: string;
    address: string;
    loveQuote: string;
    bridesMother: string;
    bridesFather: string;
    groomsMother: string;
    groomsFather: string;
    rsvpTitle: string;
    rsvpMessage: string;
    confirmAttendance: string;
    childrenNote: string;
    childrenNoteDetails: string;
    giftMessage: string;
    // Additional content translations
    oops: string;
    honorInvitation: string;
    withBlessing: string;
    usTitle: string;
    timeUntilWedding: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    eventDetails: string;
    whenQuestion: string;
    rsvpFor: string;
    dearGuest: string;
    thankYouName: string;
    rsvpSubmittedSuccessfully: string;
    celebrateWithYou: string;
    demoMessage: string;
    giftOptions: string;
    bank: string;
    account: string;
    accountName: string;
    store: string;
    visitStore: string;
    ourMemories: string;
    memoryNumber: string;
    accommodation: string;
    phone: string;
    specialRate: string;
    bookingCode: string;
    makeReservation: string;
    footerThankYou: string;
    withLoveSignature: string;
    scrollIndicator: string;
    dressCodeNote: string;
  };

  // Wedding Customization
  customization: {
    // Page titles
    customizeInvitation: string;
    personalizeInvitation: string;
    makeItYours: string;
    loadingWeddingDetails: string;
    errorLoadingDetails: string;
    backToDashboard: string;
    noWeddingFound: string;
    failedToLoad: string;
    failedToSave: string;
    unableToLoadWedding: string;
    tryAgain: string;
    createWeddingFirst: string;
    createWedding: string;
    settingsSavedSuccessfully: string;
    preview: string;
    save: string;
    previewInvitation: string;
    saveChanges: string;
    saving: string;
    
    // Tab navigation
    contentSettings: string;
    designSettings: string;
    additionalSections: string;
    venueDetails: string;
    weddingParty: string;
    settingsVisibility: string;
    contentAndText: string;
    designAndColors: string;
    weddingPartyTab: string;
    settingsAndVisibility: string;
    
    // Content tab
    invitationContent: string;
    loveQuote: string;
    welcomeMessage: string;
    welcomeMessagePlaceholder: string;
    enterText: string;
    dressCode: string;
    dressCodePlaceholder: string;
    dressCodeDescription: string;
    dressCodeDescriptionPlaceholder: string;
    specialInstructions: string;
    specialInstructionsPlaceholder: string;
    giftMessage: string;
    giftMessagePlaceholder: string;
    rsvpTitle: string;
    rsvpMessage: string;
    rsvpButtonText: string;
    parentNames: string;
    fatherName: string;
    motherName: string;
    giftRegistryTitle: string;
    giftRegistryMessage: string;
    customMessage: string;
    customMessagePlaceholder: string;
    footerMessage: string;
    footerMessagePlaceholder: string;
    footerSignature: string;
    
    // Design tab
    invitationDesign: string;
    secondaryColor: string;
    couplePhotos: string;
    bridePhoto: string;
    groomPhoto: string;
    couplePhoto: string;
    uploadBridePhoto: string;
    uploadGroomPhoto: string;
    uploadCouplePhoto: string;
    photoGallery: string;
    galleryImages: string;
    
    // Additional Sections Tab
    uploadPhotos: string;
    removePhoto: string;
    addMorePhotos: string;
    ourMemories: string;
    giftRegistry: string;
    addGiftOption: string;
    removeGiftOption: string;
    giftStoreName: string;
    giftStoreUrl: string;
    
    backgroundType: string;
    gradientBackground: string;
    solidBackground: string;
    imageBackground: string;
    backgroundImage: string;
    uploadBackgroundImage: string;
    removeBackgroundImage: string;
    templateStyle: string;
    classic: string;
    modern: string;
    rustic: string;
    backgroundPosition: string;
    centerPosition: string;
    topPosition: string;
    bottomPosition: string;
    leftPosition: string;
    rightPosition: string;
    backgroundSize: string;
    coverSize: string;
    containSize: string;
    autoSize: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    fontFamily: string;
    
    // Font Family Options
    fontGeorgia: string;
    fontTimesNewRoman: string;
    fontPlayfairDisplay: string;
    fontMerriweather: string;
    fontArial: string;
    fontHelvetica: string;
    fontOpenSans: string;
    fontLato: string;
    fontMontserrat: string;
    fontDancingScript: string;
    fontGreatVibes: string;
    fontPacifico: string;
    fontSatisfy: string;
    
    elegant: string;
    romantic: string;
    
    // Additional sections tab
    padrinos: string;
    addPadrinos: string;
    padrinoVelacion: string;
    padrinoAnillos: string;
    padrinoArras: string;
    padrinoLazo: string;
    padrinoBiblia: string;
    padrinoCojines: string;
    padrinoRamo: string;
    padrinoName: string;
    padrinoLastName: string;
    addPadrino: string;
    removePadrino: string;
    padrinoType: string;
    giftOptions: string;
    giftType: string;
    bankTransfer: string;
    storeRegistry: string;
    cash: string;
    other: string;
    giftTitle: string;
    giftDescription: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    storeName: string;
    storeUrl: string;
    hotelInformation: string;
    hotelName: string;
    hotelAddress: string;
    hotelDescription: string;
    hotelDescriptionPlaceholder: string;
    hotelPhone: string;
    bookingUrl: string;
    enterUrl: string;
    specialRate: string;
    padrinosTitle: string;
    padrinosDe: string;
    hotelInfoTitle: string;
    hotelInfoMessage: string;
    specialInstructionsTitle: string;
    specialInstructionsMessage: string;
    
    // Venue details tab
    ceremonyVenue: string;
    receptionVenue: string;
    venueName: string;
    venueAddress: string;
    venueDate: string;
    venueTime: string;
    venueDescription: string;
    city: string;
    state: string;
    zipCode: string;
    ceremonyTime: string;
    receptionTime: string;
    weddingDate: string;
    googleMapsLink: string;
    googleMapsOptional: string;
    
    // Settings & Visibility tab
    visibilitySettings: string;
    sectionVisibility: string;
    showSection: string;
    hideSection: string;
    invitationSettings: string;
    allowPlusOnes: string;
    allowChildren: string;
    rsvpDeadline: string;
    emailNotifications: string;
    isPublic: string;
    
    // Form labels and placeholders
    optional: string;
    required: string;
    chooseColor: string;
    selectFont: string;
    selectDate: string;
    selectTime: string;
    enterAddress: string;
    enterDescription: string;
    
    backgroundSettings: string;
    parentsNames: string;
    weddingPartySection: string;
    couplePhotoSection: string;
    countdownTimer: string;
    eventDetails: string;
    rsvpSection: string;
    photoGallerySection: string;
    loveQuoteSection: string;
    specialInstructionsSection: string;
  };

  // Date/Time formatting
  date: {
    months: string[];
    monthsShort: string[];
    days: string[];
    daysShort: string[];
    today: string;
    tomorrow: string;
    yesterday: string;
    am: string;
    pm: string;
  };

  // Validation messages
  validation: {
    required: string;
    invalidEmail: string;
    passwordMinLength: string;
    passwordsDoNotMatch: string;
    invalidDate: string;
    invalidTime: string;
    invalidUrl: string;
    tooShort: string;
    tooLong: string;
    invalidCharacters: string;
  };

  // Error messages
  errors: {
    general: string;
    networkError: string;
    authError: string;
    permissionDenied: string;
    notFound: string;
    alreadyExists: string;
    invalidInput: string;
    uploadFailed: string;
    deleteFailed: string;
    updateFailed: string;
  };

  // Success messages
  success: {
    saved: string;
    deleted: string;
    updated: string;
    created: string;
    sent: string;
    uploaded: string;
    invited: string;
    rsvpSubmitted: string;
  };

  // Language selection
  language: {
    selectLanguage: string;
    english: string;
    spanish: string;
    changeLanguage: string;
  };
}
