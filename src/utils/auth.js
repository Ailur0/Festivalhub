const USER_KEY = 'festivalhub_user';
const AUTH_KEY = 'festivalhub_authenticated';
const ACCOUNTS_KEY = 'festivalhub_accounts';

// Accounts made on the sign-up page live in this browser only; the web
// prototype has no server yet. Only a hash of each password is stored.
const readAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
};

const hashPassword = async (password) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizePhone = (phone) => phone.replace(/[^\d+]/g, '');

const toSessionUser = ({ passwordHash, ...account }) => ({ ...account, role: 'member' });

export const createAccount = async ({ name, email, phone, password }) => {
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizeEmail(email))) {
    throw new Error('An account with this email already exists. Sign in instead.');
  }

  const account = {
    name: name.trim(),
    email: normalizeEmail(email),
    phone: phone.trim(),
    passwordHash: await hashPassword(password),
  };
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  } catch {
    throw new Error('This browser is blocking storage, so the account could not be saved.');
  }
  return toSessionUser(account);
};

// Returns the matching account for an email or phone number and password, or null.
export const findAccount = async (emailOrPhone, password) => {
  const passwordHash = await hashPassword(password);
  const isEmail = emailOrPhone.includes('@');
  const account = readAccounts().find((candidate) =>
    candidate.passwordHash === passwordHash &&
    (isEmail
      ? candidate.email === normalizeEmail(emailOrPhone)
      : !!candidate.phone && normalizePhone(candidate.phone) === normalizePhone(emailOrPhone))
  );
  return account ? toSessionUser(account) : null;
};

// Demo-only session kept in the browser. Anyone can edit localStorage to
// "sign in", so swap this for a real auth provider before launch.
export const getCurrentUser = () => {
  try {
    if (localStorage.getItem(AUTH_KEY) !== 'true') return null;
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const signIn = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_KEY, 'true');
  } catch {
    // Storage can be blocked (e.g. private mode); the session just won't persist.
  }
};

export const signOut = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
};
