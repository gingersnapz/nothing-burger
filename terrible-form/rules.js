export const DAY = 86400000;
export const FIRST_DAY = Date.UTC(1900, 0, 1);
export function dateFromOffset(offset) {
  return new Date(FIRST_DAY + Number(offset) * DAY);
}
export function passwordRules(value) {
  const digits = value.match(/[0-9]/g) || [];
  return {
    length: value.length === 12,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    egg: value.includes('egg'),
    number: digits.length === 1 && /[13579]/.test(digits[0]),
    space: !/\s/.test(value),
  };
}
export function validateStage(stage, state) {
  if (stage === 0) {
    if (state.alias.length < 3) return 'Your existence requires at least 3 letters. Please assemble more name.';
    if (!state.birthdayConfirmed) return 'The date has not been certified as a date. Tick the birthday confirmation.';
  }
  if (stage === 1) {
    if (!state.country) return 'Please select the imaginary jurisdiction responsible for this situation.';
    if (!Object.values(passwordRules(state.password)).every(Boolean)) return 'The password committee objects. Every rule must have a checkmark. A loophole is available below the rules.';
  }
  if (stage === 2) {
    if (!state.termsRead || !state.termsAccepted) return 'Scroll to the bottom of the terms, then confirm that you scrolled past the things.';
    if (state.human !== 'two') return 'Humanity unconfirmed. Count the “not”s: an even number is required. Two is an even number.';
  }
  return '';
}
