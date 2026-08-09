import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
const storageKey = 'civicsense_language';

export const LANGUAGES = {
  mr: 'मराठी',
  en: 'English',
};

export const STATUSES = ['Pending', 'In Review', 'Resolved', 'Rejected'];
export const CATEGORIES = ['Road', 'Water', 'Streetlight', 'Garbage', 'Drainage', 'Health', 'School', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

const dictionaries = {
  mr: {
    appName: 'CivicSense',
    appSubtitle: 'परळी ग्राम तक्रार व्यवस्थापन',
    nav: {
      dashboard: 'डॅशबोर्ड',
      adminPanel: 'अधिकारी पॅनेल',
      newComplaint: 'तक्रार नोंदवा',
      login: 'लॉगिन',
      register: 'नोंदणी',
      logout: 'बाहेर पडा',
      languageLabel: 'भाषा',
    },
    roles: {
      citizen: 'नागरिक',
      admin: 'अधिकारी',
    },
    status: {
      Pending: 'प्रलंबित',
      'In Review': 'तपासणी चालू',
      Resolved: 'सोडवले',
      Rejected: 'नाकारले',
    },
    category: {
      Road: 'रस्ता / खड्डा',
      Water: 'पाणीपुरवठा',
      Streetlight: 'वीज / स्ट्रीटलाईट',
      Garbage: 'कचरा',
      Drainage: 'नाली / गटार',
      Health: 'आरोग्य',
      School: 'शाळा',
      Other: 'इतर',
    },
    priority: {
      Low: 'कमी',
      Medium: 'मध्यम',
      High: 'जास्त',
    },
    home: {
      eyebrow: 'परळी गावासाठी प्रोटोटाइप',
      title: 'परळी गावातील तक्रारी नोंदवा, पाहा आणि सोडवा.',
      description:
        'परळी गावातील नागरिक मराठीत तक्रार नोंदवू शकतात आणि ग्रामपंचायत अधिकारी एका सोप्या डॅशबोर्डमधून तक्रारींची स्थिती बदलू शकतात. हा प्रोटोटाइप परळी गावातील स्थानिक समस्या व्यवस्थापनासाठी तयार केला आहे.',
      primaryLoggedIn: 'डॅशबोर्ड उघडा',
      primaryLoggedOut: 'तक्रार सुरू करा',
      secondary: 'लॉगिन',
      cardTitle: 'प्रोटोटाइपमध्ये काय आहे',
      features: [
        'परळी गावासाठी मराठी आणि इंग्रजी भाषा पर्याय',
        'नागरिक आणि अधिकारी भूमिका',
        'परळीतील रस्ता, पाणी, कचरा, गटार, आरोग्य अशा स्थानिक तक्रारी',
        'तक्रार स्थिती ट्रॅकिंग आणि अधिकारी व्यवस्थापन',
      ],
    },
    auth: {
      loginTitle: 'परत स्वागत आहे',
      loginSubtitle: 'तक्रार पाहण्यासाठी किंवा व्यवस्थापित करण्यासाठी लॉगिन करा.',
      registerTitle: 'खाते तयार करा',
      registerSubtitle: 'नागरिक म्हणून नोंदणी करा किंवा डेमो अधिकारी खाते तयार करा.',
      name: 'नाव',
      email: 'ईमेल',
      password: 'पासवर्ड',
      role: 'भूमिका',
      adminCode: 'अधिकारी सेटअप कोड',
      adminCodePlaceholder: 'backend .env मधील कोड',
      loggingIn: 'लॉगिन होत आहे...',
      loginButton: 'लॉगिन',
      creating: 'खाते तयार होत आहे...',
      createButton: 'खाते तयार करा',
      newHere: 'नवीन आहात?',
      createAccount: 'खाते तयार करा',
      alreadyRegistered: 'आधीच नोंदणी केली आहे?',
      loginFailed: 'लॉगिन झाले नाही. पुन्हा प्रयत्न करा.',
      registrationFailed: 'नोंदणी झाली नाही. पुन्हा प्रयत्न करा.',
    },
    complaint: {
      citizenReport: 'नागरिक तक्रार',
      submitTitle: 'तक्रार नोंदवा',
      submitSubtitle:
        'या प्रोटोटाइपमध्ये तक्रारीचे तपशील, प्रकार, प्राधान्य आणि ठिकाण नोंदवता येते. फोटो अपलोड आणि नकाशा पुढील टप्प्यात जोडता येईल.',
      title: 'शीर्षक',
      titlePlaceholder: 'परळी मुख्य रस्त्यावर मोठा खड्डा आहे',
      description: 'तपशील',
      descriptionPlaceholder: 'समस्या, जवळची खूण आणि तातडी याबद्दल माहिती द्या.',
      category: 'तक्रारीचा प्रकार',
      priority: 'प्राधान्य',
      address: 'पत्ता / ठिकाण',
      addressPlaceholder: 'परळी ग्रामपंचायत कार्यालयाजवळ, वार्ड २',
      latitude: 'अक्षांश',
      longitude: 'रेखांश',
      optional: 'ऐच्छिक',
      imageUrl: 'फोटो URL',
      imageUrlPlaceholder: 'Cloudinary जोडण्यापूर्वी ऐच्छिक',
      submitting: 'तक्रार नोंदवत आहे...',
      submitButton: 'तक्रार सबमिट करा',
      submitFailed: 'तक्रार नोंदवता आली नाही.',
      loading: 'तक्रार लोड होत आहे...',
      loadFailed: 'तक्रार लोड करता आली नाही.',
      backToDashboard: '← डॅशबोर्डकडे परत',
      reportedBy: 'नोंदवणारे',
      notProvided: 'दिलेली नाही',
      unknown: 'अज्ञात',
      coordinates: 'स्थान निर्देशांक',
    },
    dashboard: {
      adminWorkspace: 'अधिकारी कार्यक्षेत्र',
      citizenWorkspace: 'नागरिक कार्यक्षेत्र',
      adminTitle: 'तक्रार व्यवस्थापन',
      citizenTitle: 'माझ्या तक्रारी',
      submitComplaint: 'तक्रार नोंदवा',
      searchPlaceholder: 'शीर्षक, तपशील किंवा ठिकाण शोधा',
      allStatuses: 'सर्व स्थिती',
      allCategories: 'सर्व प्रकार',
      loading: 'तक्रारी लोड होत आहेत...',
      empty: 'अजून कोणतीही तक्रार नाही.',
      loadFailed: 'डॅशबोर्ड लोड करता आला नाही.',
      statusUpdateFailed: 'स्थिती बदलता आली नाही.',
      table: {
        complaint: 'तक्रार',
        category: 'प्रकार',
        status: 'स्थिती',
        priority: 'प्राधान्य',
        citizen: 'नागरिक',
        action: 'कृती',
        view: 'पाहा',
      },
    },
    adminPanel: {
      eyebrow: 'परळी ग्रामपंचायत अधिकारी पॅनेल',
      title: 'तक्रारींचे नियंत्रण केंद्र',
      subtitle:
        'परळी गावातील सर्व तक्रारी, प्राधान्य आणि स्थिती एका ठिकाणी पाहा. अधिकारी येथून तक्रारी तपासणीसाठी घेऊ शकतात किंवा सोडवले म्हणून अपडेट करू शकतात.',
      demoArea: 'डेमो क्षेत्र',
      demoAreaValue: 'परळी गाव · ग्रामपंचायत परळी',
      total: 'एकूण तक्रारी',
      complaintQueue: 'तक्रार यादी',
      queueSubtitle: 'तक्रारी फिल्टर करा, नागरिक तपशील पाहा आणि स्थिती बदला.',
      highPriority: 'जास्त प्राधान्य',
      categoryBreakdown: 'प्रकारानुसार तक्रारी',
      workflowTitle: 'स्थिती प्रक्रिया',
      loadFailed: 'अधिकारी पॅनेल लोड करता आले नाही.',
      statusUpdateFailed: 'स्थिती बदलता आली नाही.',
    },
  },
  en: {
    appName: 'CivicSense',
    appSubtitle: 'Parali village complaint management',
    nav: {
      dashboard: 'Dashboard',
      adminPanel: 'Admin Panel',
      newComplaint: 'New Complaint',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      languageLabel: 'Language',
    },
    roles: {
      citizen: 'Citizen',
      admin: 'Officer',
    },
    status: {
      Pending: 'Pending',
      'In Review': 'In Review',
      Resolved: 'Resolved',
      Rejected: 'Rejected',
    },
    category: {
      Road: 'Road / Pothole',
      Water: 'Water Supply',
      Streetlight: 'Electricity / Streetlight',
      Garbage: 'Garbage',
      Drainage: 'Drainage',
      Health: 'Health',
      School: 'School',
      Other: 'Other',
    },
    priority: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
    },
    home: {
      eyebrow: 'Prototype for Parali village',
      title: 'Report, track, and resolve complaints from Parali village.',
      description:
        'Citizens from Parali village can submit complaints in Marathi, while Gram Panchayat officers can manage status from a simple dashboard. This prototype is designed for local village-level issue management.',
      primaryLoggedIn: 'Go to dashboard',
      primaryLoggedOut: 'Start reporting',
      secondary: 'Login',
      cardTitle: 'What the prototype includes',
      features: [
        'Marathi and English language switch for Parali village',
        'Citizen and officer roles',
        'Local issue categories like roads, water, garbage, drainage, and health',
        'Complaint status tracking and officer-side management',
      ],
    },
    auth: {
      loginTitle: 'Welcome back',
      loginSubtitle: 'Login to manage or track civic complaints.',
      registerTitle: 'Create account',
      registerSubtitle: 'Register as a citizen, or create an officer demo account.',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      role: 'Role',
      adminCode: 'Officer setup code',
      adminCodePlaceholder: 'From backend .env',
      loggingIn: 'Logging in...',
      loginButton: 'Login',
      creating: 'Creating account...',
      createButton: 'Create account',
      newHere: 'New here?',
      createAccount: 'Create an account',
      alreadyRegistered: 'Already registered?',
      loginFailed: 'Login failed. Please try again.',
      registrationFailed: 'Registration failed. Please try again.',
    },
    complaint: {
      citizenReport: 'Citizen report',
      submitTitle: 'Submit a complaint',
      submitSubtitle:
        'This prototype captures complaint details, category, priority, and location. Photo upload and map pinning can be added in the next phase.',
      title: 'Title',
      titlePlaceholder: 'Large pothole on Parali main road',
      description: 'Description',
      descriptionPlaceholder: 'Describe the issue, nearby landmarks, and urgency.',
      category: 'Complaint type',
      priority: 'Priority',
      address: 'Address or landmark',
      addressPlaceholder: 'Near Parali Gram Panchayat office, Ward 2',
      latitude: 'Latitude',
      longitude: 'Longitude',
      optional: 'Optional',
      imageUrl: 'Photo URL',
      imageUrlPlaceholder: 'Optional until Cloudinary is added',
      submitting: 'Submitting...',
      submitButton: 'Submit complaint',
      submitFailed: 'Could not submit complaint.',
      loading: 'Loading complaint...',
      loadFailed: 'Could not load complaint.',
      backToDashboard: '← Back to dashboard',
      reportedBy: 'Reported by',
      notProvided: 'Not provided',
      unknown: 'Unknown',
      coordinates: 'Coordinates',
    },
    dashboard: {
      adminWorkspace: 'Officer workspace',
      citizenWorkspace: 'Citizen workspace',
      adminTitle: 'Complaint management',
      citizenTitle: 'My complaints',
      submitComplaint: 'Submit complaint',
      searchPlaceholder: 'Search title, description, or address',
      allStatuses: 'All statuses',
      allCategories: 'All categories',
      loading: 'Loading complaints...',
      empty: 'No complaints found yet.',
      loadFailed: 'Could not load dashboard.',
      statusUpdateFailed: 'Could not update status.',
      table: {
        complaint: 'Complaint',
        category: 'Category',
        status: 'Status',
        priority: 'Priority',
        citizen: 'Citizen',
        action: 'Action',
        view: 'View',
      },
    },
    adminPanel: {
      eyebrow: 'Parali Gram Panchayat officer panel',
      title: 'Complaint control center',
      subtitle:
        'View every Parali village complaint, priority, and status in one place. Officers can move complaints into review or mark them as resolved from here.',
      demoArea: 'Demo area',
      demoAreaValue: 'Parali village · Parali Gram Panchayat',
      total: 'Total complaints',
      complaintQueue: 'Complaint queue',
      queueSubtitle: 'Filter complaints, review citizen details, and update status.',
      highPriority: 'High priority',
      categoryBreakdown: 'Category breakdown',
      workflowTitle: 'Status workflow',
      loadFailed: 'Could not load admin panel.',
      statusUpdateFailed: 'Could not update status.',
    },
  },
};

const getNestedValue = (source, path) =>
  path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), source);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem(storageKey) || 'mr');

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.mr;

    const t = (path) => getNestedValue(dictionary, path) ?? getNestedValue(dictionaries.en, path) ?? path;
    const label = (group, valueToTranslate) => dictionary[group]?.[valueToTranslate] || valueToTranslate;

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'mr' ? 'en' : 'mr')),
      t,
      label,
      languages: LANGUAGES,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider.');
  }

  return context;
};
