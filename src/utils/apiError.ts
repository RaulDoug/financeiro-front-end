/**
 * Extrai a mensagem de erro mais descritiva retornada pela API ou Axios.
 * Suporta o formato do back-end FinFlow:
 * { status: 'fail', errors: [{ field: 'body.description', message: 'A descrição deve conter no mínimo 3 caracteres' }] }
 * além de response.data.message, response.data.error e message padrão.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível salvar a transação. Verifique os dados.'
): string {
  if (!error) return fallback;

  const err = error as any;

  // 1. Array de erros do Zod/middleware validate.js ({ status: 'fail', errors: [...] })
  const errorsList = err?.response?.data?.errors;
  if (Array.isArray(errorsList) && errorsList.length > 0) {
    const messages = errorsList
      .map((e: any) => e.message || e.error)
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  // 2. Mensagem explícita no corpo da resposta
  if (err?.response?.data?.message && typeof err.response.data.message === 'string') {
    return err.response.data.message;
  }

  // 3. Campo error no corpo da resposta
  if (err?.response?.data?.error && typeof err.response.data.error === 'string') {
    return err.response.data.error;
  }

  // 4. Erros 500 do servidor
  if (err?.response?.status === 500 || err?.statusCode === 500) {
    return 'Não foi possível completar a operação devido a um erro no servidor. Tente novamente.';
  }

  // 5. Mensagem direta da exceção caso não seja a genérica de status code do Axios
  if (typeof err?.message === 'string' && !err.message.includes('status code')) {
    return err.message;
  }

  return fallback;
}
