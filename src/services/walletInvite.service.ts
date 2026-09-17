import { api } from '../lib/axios.ts';

export type WalletInviteRole = 'owner' | 'editor' | 'viewer';
export type WalletInviteStatus = 'pending' | 'accepted' | 'rejected';

export interface WalletInvite {
  id: string;
  wallet_id: string;
  inviter_user_id: string;
  invited_email: string;
  role: 'editor' | 'viewer';
  status: WalletInviteStatus;
  created_at: string;
  wallet_name?: string;
}

export interface SendInviteParams {
  inviter_user_id: string;
  invited_email: string;
  role: 'editor' | 'viewer';
  wallet_id?: string;
}

export interface SendInviteResponse {
  message: string;
  rows: WalletInvite;
}

export interface FindInvitesResponse {
  result: {
    rows: WalletInvite[];
  };
}

export interface RespondInviteParams {
  invite_id: string;
  wallet_id: string;
  accept: boolean;
}

export interface RespondInviteResponse {
  result: {
    acceptResult: WalletInvite;
    insertResult?: {
      user_id: string;
      wallet_id: string;
      role: string;
    };
  };
}

export const INVITE_QUERY_KEYS = {
  all: ['wallet-invites'] as const,
  pending: () => ['wallet-invites', 'pending'] as const,
};

export const walletInviteService = {
  async sendInvite(params: SendInviteParams): Promise<SendInviteResponse> {
    const headers: Record<string, string> = {};
    if (params.wallet_id) {
      headers['x-wallet-id'] = params.wallet_id;
    }

    const response = await api.post<SendInviteResponse>(
      '/wallet-invite/send-invite',
      {},
      {
        params: {
          inviter_user_id: params.inviter_user_id,
          invited_email: params.invited_email.trim().toLowerCase(),
          role: params.role,
        },
        headers,
      }
    );
    return response.data;
  },

  async getPendingInvites(): Promise<WalletInvite[]> {
    const response = await api.get<FindInvitesResponse>('/wallet-invite/find-invites');
    return response.data?.result?.rows || [];
  },

  async respondInvite(params: RespondInviteParams): Promise<RespondInviteResponse> {
    const response = await api.patch<RespondInviteResponse>(
      '/wallet-invite/accept-invite',
      {},
      {
        params: {
          accept: params.accept ? 'true' : 'false',
          wallet_id: params.wallet_id,
          invite_id: params.invite_id,
        },
      }
    );
    return response.data;
  },
};

export default walletInviteService;

