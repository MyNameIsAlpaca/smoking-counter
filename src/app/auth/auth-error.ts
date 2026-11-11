export function getAuthErrorMessage(error: unknown): string {
  let message = '';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    const errorMessage = error.message;
    if (typeof errorMessage === 'string') {
      message = errorMessage;
    }
  }

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Email o password non corrette.';
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'L’email dell’utente non è stata confermata. Contatta l’amministratore.';
  }

  if (
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('fetch error') ||
    normalizedMessage.includes('load failed')
  ) {
    return 'Impossibile raggiungere Supabase. Controlla la connessione e riprova.';
  }

  if (
    normalizedMessage.includes('session expired') ||
    normalizedMessage.includes('session missing') ||
    normalizedMessage.includes('refresh token') ||
    normalizedMessage.includes('jwt expired') ||
    normalizedMessage.includes('token has expired')
  ) {
    return 'La sessione è scaduta. Accedi di nuovo.';
  }

  return message || 'Si è verificato un errore imprevisto. Riprova.';
}
