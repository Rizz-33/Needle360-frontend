export const footerConfigs = {
  customerSignup: {
    loginSignupRedirect: {
      text: "Already have an account?",
      link: "/login",
      linkText: "Login",
    },
    terms: {
      text: "By signing up, you agree to our",
      link: "/terms",
      linkText: "Terms of Service",
    },
    privacy: {
      link: "/privacy",
      linkText: "Privacy Policy",
    },
    alternateSignup: {
      text: "Tailor shop?",
      link: "/signup",
      linkText: "Request to sign up as a Tailor Shop",
    },
  },
  customerLogin: {
    loginSignupRedirect: {
      text: "Don't have an account?",
      link: "/signup",
      linkText: "Signup",
    },
    terms: {
      text: "By signing up, you agree to our",
      link: "/terms",
      linkText: "Terms of Service",
    },
    privacy: {
      link: "/privacy",
      linkText: "Privacy Policy",
    },
    alternateSignup: {
      text: "Tailor shop?",
      link: "/signup",
      linkText: "Login as a Tailor Shop",
    },
  },
  tailorSignup: {
    loginSignupRedirect: {
      text: "Already have an account?",
      link: "/login",
      linkText: "Login",
    },
    terms: {
      text: "By signing up, you agree to our",
      link: "/terms",
      linkText: "Terms of Service",
    },
    privacy: {
      link: "/privacy",
      linkText: "Privacy Policy",
    },
    alternateSignup: {
      text: "Customer?",
      link: "/signup",
      linkText: "Sign up as a Customer",
    },
  },
  tailorLogin: {
    loginSignupRedirect: {
      text: "Don't have an account?",
      link: "/signup",
      linkText: "Signup",
    },
    terms: {
      text: "By signing up, you agree to our",
      link: "/terms",
      linkText: "Terms of Service",
    },
    privacy: {
      link: "/privacy",
      linkText: "Privacy Policy",
    },
    alternateSignup: {
      text: "Customer?",
      link: "/signup",
      linkText: "Sign up as a Customer",
    },
  },
  adminLogin: {
    loginSignupRedirect: {
      text: null,
      link: null,
      linkText: null,
    },
    terms: {
      text: null,
      link: null,
      linkText: null,
    },
    privacy: {
      link: null,
      linkText: null,
    },
    alternateSignup: {
      text: null,
      link: null,
      linkText: null,
    },
  },
  adminSignup: {
    loginSignupRedirect: {
      text: null,
      link: null,
      linkText: null,
    },
    terms: {
      text: null,
      link: null,
      linkText: null,
    },
    privacy: {
      link: null,
      linkText: null,
    },
    alternateSignup: {
      text: null,
      link: null,
      linkText: null,
    },
  },
  forgotPassword: {
    loginSignupRedirect: {
      text: "Remembered your password?",
      link: "/login",
      linkText: "Login",
    },
    terms: {
      text: null,
      link: null,
      linkText: null,
    },
    privacy: {
      link: null,
      linkText: null,
    },
    alternateSignup: {
      text: null,
      link: null,
      linkText: null,
    },
  },
};

export const headingConfigs = {
  customerSignup: {
    heading1:
      "Looking for the perfect fit? Find a tailor that meets your needs.",
    heading2:
      "Sign up to browse profiles of expert tailors, design, view reviews, and order your custom tailoring items.",
  },
  customerLogin: {
    heading1: "Welcome Back to our platform!",
    heading2:
      "Log in to your account to connect with tailors or manage your services.",
  },
  tailorSignup: {
    heading1: "Ready to grow your business?",
    heading2:
      "Sign up to create your tailor shop profile, list your services, and connect with customers.",
  },
  tailorLogin: {
    heading1: "Welcome Back to our platform!",
    heading2:
      "Log in to your account to manage your tailor shop or connect with customers.",
  },
  adminLogin: {
    heading1: "Welcome Back Admin!",
    heading2: "Log in to your account to manage the platform.",
  },
  adminSignup: {
    heading1: "Welcome Admin!",
    heading2: "Sign up to create your admin account.",
  },
  forgotPassword: {
    heading1: "Forgot your password?",
    heading2: "Enter your email address to reset your password.",
  },
  resetPassword: {
    heading1: "Reset your password",
    heading2: "Enter a new password for your account.",
  },
};

export const provinceCityMapping = {
  "Central Province": [
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Hatton",
    "Nawalapitiya",
    "Wattegama",
    "Gampola",
    "Dambulla",
    "Rikillagaskada",
    "Talawakele",
    "Pussellawa",
  ],
  "Eastern Province": [
    "Ampara",
    "Batticaloa",
    "Trincomalee",
    "Kalmunai",
    "Kattankudy",
    "Eravur",
    "Akkaraipattu",
    "Pottuvil",
    "Sainthamaruthu",
    "Sammanthurai",
    "Addalaichenai",
    "Thirukkovil",
    "Karaitivu",
    "Oluvil",
    "Kalkudah",
    "Oddamavadi",
  ],
  "Northern Province": [
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Mullaitivu",
    "Vavuniya",
    "Point Pedro",
    "Chavakachcheri",
    "Nallur",
    "Kankesanthurai",
    "Pooneryn",
  ],
  "Southern Province": [
    "Galle",
    "Hambantota",
    "Matara",
    "Tangalle",
    "Weligama",
    "Ahangama",
    "Ambalantota",
    "Tissamaharama",
    "Dikwella",
    "Mirissa",
  ],
  "Western Province": [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Dehiwala-Mount Lavinia",
    "Negombo",
    "Wattala",
    "Moratuwa",
    "Sri Jayawardenepura Kotte",
    "Katunayake",
    "Homagama",
    "Panadura",
    "Beruwala",
    "Horana",
    "Minuwangoda",
    "Ja-Ela",
  ],
  "North Western Province": [
    "Kurunegala",
    "Puttalam",
    "Chilaw",
    "Kuliyapitiya",
    "Maho",
    "Nikaweratiya",
    "Wennappuwa",
    "Narammala",
    "Dankotuwa",
    "Marawila",
    "Anamaduwa",
    "Madampe",
    "Mawathagama",
    "Kalpitiya",
  ],
  "North Central Province": [
    "Anuradhapura",
    "Polonnaruwa",
    "Medirigiriya",
    "Kekirawa",
    "Habarana",
    "Mihintale",
    "Thambuttegama",
    "Galenbindunuwewa",
  ],
  "Uva Province": [
    "Badulla",
    "Monaragala",
    "Bandarawela",
    "Haputale",
    "Welimada",
    "Mahiyanganaya",
    "Passara",
    "Bibila",
  ],
  "Sabaragamuwa Province": [
    "Ratnapura",
    "Kegalle",
    "Balangoda",
    "Embilipitiya",
    "Rambukkana",
    "Mawanella",
    "Yatiyanthota",
    "Dehiowita",
    "Kitulgala",
    "Aranayake",
    "Bulathkohupitiya",
    "Deraniyagala",
    "Galigamuwa",
    "Hemmathagama",
  ],
};
