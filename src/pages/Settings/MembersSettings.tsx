import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Mail,
  UserPlus,
  Check,
  X,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import {
  walletInviteService,
  INVITE_QUERY_KEYS,
  type WalletInvite,
} from '../../services/walletInvite.service.ts';

export const MembersSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const currentWallet = useWalletStore((state) => state.currentWallet);
  const fetchWallets = useWalletStore((state) => state.fetchWallets);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [isSending, setIsSending] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [sendFeedback, setSendFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quem cria a carteira é proprietário por padrão; apenas papéis explícitos de editor/viewer limitam o acesso
  const isOwner = currentWallet?.role === 'owner' || (currentWallet?.role !== 'editor' && currentWallet?.role !== 'viewer');

  // Consulta de convites pendentes recebidos pelo usuário logado
  const {
    data: pendingInvites = [],
    isLoading: isLoadingInvites,
    refetch: refetchInvites,
  } = useQuery({
    queryKey: INVITE_QUERY_KEYS.pending(),
    queryFn: () => walletInviteService.getPendingInvites(),
  });

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendFeedback(null);

    if (!email.trim()) {
      setSendFeedback({ type: 'error', message: 'Informe o e-mail do usuário que deseja convidar.' });
      return;
    }

    if (!user?.id) {
      setSendFeedback({ type: 'error', message: 'Usuário não autenticado.' });
      return;
    }

    const activeWalletId =
      currentWallet?.id ||
      useWalletStore.getState().currentWalletId ||
      useAuthStore.getState().activeWalletId;

    if (!activeWalletId) {
      setSendFeedback({ type: 'error', message: 'Nenhuma carteira ativa selecionada.' });
      return;
    }

    if (!isOwner) {
      setSendFeedback({ type: 'error', message: 'Apenas o proprietário da carteira pode enviar convites.' });
      return;
    }

    setIsSending(true);
    try {
      const response = await walletInviteService.sendInvite({
        inviter_user_id: user.id,
        invited_email: email.trim(),
        role,
        wallet_id: activeWalletId,
      });

      setSendFeedback({
        type: 'success',
        message: response.message || `Convite enviado com sucesso para ${email}!`,
      });
      setEmail('');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Não foi possível enviar o convite. Verifique os dados.';
      setSendFeedback({ type: 'error', message });
    } finally {
      setIsSending(false);
    }
  };

  const handleRespondInvite = async (invite: WalletInvite, accept: boolean) => {
    setRespondingId(invite.id);
    setActionFeedback(null);

    try {
      await walletInviteService.respondInvite({
        invite_id: invite.id,
        wallet_id: invite.wallet_id,
        accept,
      });

      setActionFeedback({
        type: 'success',
        message: accept
          ? 'Convite aceito com sucesso! A carteira foi vinculada à sua conta.'
          : 'Convite recusado.',
      });

      // Recarrega convites pendentes e a lista global de carteiras do usuário
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: INVITE_QUERY_KEYS.all }),
        refetchInvites(),
        fetchWallets(),
      ]);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Erro ao responder ao convite.';
      setActionFeedback({ type: 'error', message });
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Equipe & Membros</h2>
        <p className="text-sm text-slate-500">
          Gerenciamento de acessos compartilhados, convites e permissões da carteira.
        </p>
      </div>

      {/* Feedback de ação global */}
      {actionFeedback && (
        <div
          role="status"
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Seção 1: Convites Pendentes Recebidos */}
      <div
        data-testid="received-invites-section"
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Convites Recebidos</h3>
              <p className="text-xs text-slate-500">
                Carteiras que convidaram você para participar como colaborador.
              </p>
            </div>
          </div>
          {pendingInvites.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {pendingInvites.length} pendente{pendingInvites.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoadingInvites ? (
          <div className="py-8 flex items-center justify-center text-slate-400 gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Carregando convites...</span>
          </div>
        ) : pendingInvites.length === 0 ? (
          <div className="py-6 text-center text-slate-400 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">Nenhum convite pendente</p>
            <p className="text-xs text-slate-400">
              Quando alguém convidar você para uma carteira, o convite aparecerá aqui e no sino de notificações.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvites.map((invite) => {
              const isResponding = respondingId === invite.id;
              return (
                <div
                  key={invite.id}
                  data-testid={`invite-card-${invite.id}`}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        Convite para Compartilhamento de Carteira
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        {invite.role === 'editor' ? 'Editor' : 'Visualizador'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      ID da Carteira: <code className="text-slate-700 font-mono text-[11px]">{invite.wallet_id}</code>
                      {invite.created_at && (
                        <span> • Recebido em {new Date(invite.created_at).toLocaleDateString('pt-BR')}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      data-testid={`accept-invite-${invite.id}`}
                      disabled={isResponding}
                      onClick={() => handleRespondInvite(invite, true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      {isResponding ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Aceitar</span>
                    </button>
                    <button
                      type="button"
                      data-testid={`reject-invite-${invite.id}`}
                      disabled={isResponding}
                      onClick={() => handleRespondInvite(invite, false)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recusar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Seção 2: Convidar Novo Membro para a Carteira Ativa */}
      <div
        data-testid="send-invite-section"
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Convidar Novo Membro</h3>
            <p className="text-xs text-slate-500">
              Adicione colaboradores à carteira ativa: <span className="font-semibold text-slate-700">{currentWallet?.name || 'Carteira'}</span>
            </p>
          </div>
        </div>

        {!isOwner ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">Apenas o proprietário pode enviar convites</p>
              <p className="text-amber-800">
                Seu papel atual nesta carteira é <strong className="capitalize">{currentWallet?.role === 'viewer' ? 'Visualizador' : 'Editor'}</strong>. Somente o usuário com papel <strong>proprietário (owner)</strong> tem permissão para adicionar outros usuários.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="space-y-4 max-w-xl">
            {sendFeedback && (
              <div
                role="status"
                className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                  sendFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {sendFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{sendFeedback.message}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="invite-email" className="block text-xs font-semibold text-slate-700">
                E-mail do Convidado
              </label>
              <input
                id="invite-email"
                type="email"
                data-testid="input-invited-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-role" className="block text-xs font-semibold text-slate-700">
                Nível de Acesso (Papel)
              </label>
              <select
                id="invite-role"
                data-testid="select-invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="editor">Editor — Pode criar, editar transações e gerenciar categorias</option>
                <option value="viewer">Visualizador — Apenas visualização de transações e relatórios</option>
              </select>
            </div>

            <button
              type="submit"
              data-testid="btn-send-invite"
              disabled={isSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Convite...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Enviar Convite</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Seção 3: Informações de Membros e Recursos Futuros */}
      <div
        data-testid="members-placeholder"
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Compartilhamento de Carteiras & Gestão de Equipe
              </h3>
              <p className="text-xs text-slate-500">
                Controle de participantes e níveis de privilégio.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Em Breve
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          O recurso de convites de membros, controle granular de papéis (proprietário, editor, visualizador) e auditoria de atividades estará disponível em uma próxima versão.
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Níveis de Acesso Granulares
            </div>
            <p className="text-xs text-slate-500">
              Defina quem pode criar lançamentos ou apenas visualizar gráficos e faturas.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              Colaboração em Tempo Real
            </div>
            <p className="text-xs text-slate-500">
              Gerencie despesas de família ou negócios com múltiplos participantes e notificações no sino.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersSettings;
