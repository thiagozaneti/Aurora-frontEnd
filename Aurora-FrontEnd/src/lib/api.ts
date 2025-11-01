const API_BASE = "http://72.60.8.246/api/v1";

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  exp: string;
}

export interface AnalysisRequest {
  text: string;
}

export interface Criterio {
  nota: number;
  comentarioC1?: string;
  comentarioC2?: string;
  comentarioC3?: string;
  comentarioC4?: string;
  comentarioC5?: string;
  starsC1?: number;
  starsC2?: number;
  starsC3?: number;
  starsC4?: number;
  starsC5?: number;
  stars: number;
}

export interface AnalysisResponse {
  id: number;
  created_at: string;
  nota_total: number;
  stars: number;
  criterios: {
    norma: Criterio;
    repertorio: Criterio;
    coerencia: Criterio;
    coesao: Criterio;
    intervencao: Criterio;
  };
}

// Estrutura das redações salvas (lista do usuário)
export interface EssayCriterion {
  nota: number;
  obs: string;
  stars: number;
}

export interface Essay {
  id: number;
  created_at: string;
  input_text: string;
  nota_total: number;
  stars: number;
  criterios: {
    norma: EssayCriterion;
    repertorio: EssayCriterion;
    coerencia: EssayCriterion;
    coesao: EssayCriterion;
    intervencao: EssayCriterion;
  };
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    // Backend exige username em minúsculas; normalizamos aqui
    const payload = {
      username: data.username.trim().toLowerCase(),
      password: data.password,
    };
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new Error("Não foi possível criar a conta. Verifique os dados e tente novamente.");
      }
      throw new Error("Falha ao criar conta. Tente novamente mais tarde.");
    }
    return response;
  },

  login: async (data: RegisterRequest): Promise<LoginResponse> => {
    const body = new URLSearchParams({
      username: data.username.trim().toLowerCase(),
      password: data.password,
    });
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao fazer login");
    }
    return response.json();
  },
};

export const analysisApi = {
  analyzeText: async (text: string, token: string): Promise<AnalysisResponse> => {
    const clean = text.replace(/[\r\n]+/g, " ").replace(/["']/g, "");
    const response = await fetch(`${API_BASE}/analysis/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: clean }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao analisar texto");
    }
    return response.json();
  },
};

export const userApi = {
  getEssays: async (token: string): Promise<Essay[]> => {
    const response = await fetch(`${API_BASE}/users/essays`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao carregar redações");
    }
    return response.json();
  },
};
