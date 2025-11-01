import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { analysisApi, AnalysisResponse, userApi, Essay } from "@/lib/api";
import { toast } from "sonner";
import auroraLogo from "@/assets/aurora-logo.png";
import { LogOut, Loader2, Star, Send } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, username, logout, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [essays, setEssays] = useState<Essay[]>([]);
  const MIN_CHARS = 750;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchEssays = async () => {
      if (!token) return;
      try {
        const list = await userApi.getEssays(token);
        setEssays(list);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao carregar redações");
      }
    };
    fetchEssays();
  }, [token]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Escreva sua redação antes de enviar");
      return;
    }
    if (text.trim().length < MIN_CHARS) {
      toast.error(`A redação deve ter pelo menos ${MIN_CHARS} caracteres`);
      return;
    }
    if (!token) return;

    setLoading(true);
    try {
      const result = await analysisApi.analyzeText(text.trim(), token);
      setAnalysis(result);
      try {
        const list = await userApi.getEssays(token);
        setEssays(list);
      } catch {}
      toast.success("Avaliação concluída! Veja os resultados abaixo");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao analisar redação");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Até logo!");
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < count
                ? "fill-warning text-warning"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const criteriaData = analysis
    ? [
        {
          title: "Norma Culta",
          key: "norma",
          description: "Domínio da modalidade escrita formal",
        },
        {
          title: "Repertório",
          key: "repertorio",
          description: "Compreensão do tema e uso de repertório",
        },
        {
          title: "Coerência",
          key: "coerencia",
          description: "Argumentação e defesa de ponto de vista",
        },
        {
          title: "Coesão",
          key: "coesao",
          description: "Articulação dos argumentos",
        },
        {
          title: "Intervenção",
          key: "intervencao",
          description: "Proposta de intervenção",
        },
      ]
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={auroraLogo} alt="Aurora" className="h-10" />
            <div>
              <p className="text-sm text-muted-foreground">Olá,</p>
              <p className="font-semibold">{username}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Submission Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-heading">Envie sua redação</CardTitle>
            <CardDescription>
              Escreva ou cole seu texto abaixo. Aurora irá avaliar todas as competências do ENEM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Cole sua redação aqui..."
              className="min-h-[300px] text-base leading-relaxed resize-none mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Mínimo {MIN_CHARS} caracteres</span>
              <span className={`${text.trim().length < MIN_CHARS ? "text-destructive" : "text-success"}`}>
                {text.trim().length}/{MIN_CHARS}
              </span>
            </div>
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading || !text.trim() || text.trim().length < MIN_CHARS}
                className="px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Enviar para avaliação
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="animate-fade-in">
            <section className="rounded-lg overflow-hidden border shadow-sm">
              <header className="gradient-aurora text-primary-foreground p-4 md:p-5 text-center">
                <p className="text-xs uppercase tracking-wide opacity-90">Resultado</p>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mt-0.5">
                  Nota Total: {analysis.nota_total}
                </h2>
                <div className="flex justify-center mt-1">{renderStars(analysis.stars)}</div>
              </header>
              <div className="divide-y">
                {criteriaData.map((criteria) => {
                  const criterio = analysis.criterios[criteria.key as keyof typeof analysis.criterios];
                  const comment =
                    criterio[`comentarioC${criteriaData.indexOf(criteria) + 1}` as keyof typeof criterio] as string | undefined;

                  return (
                    <div key={criteria.key} className="p-4 md:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-base md:text-lg">{criteria.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{criteria.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm md:text-base font-semibold px-2.5 py-0.5">
                          {criterio.nota}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="opacity-90">{renderStars(criterio.stars)}</div>
                      </div>
                      {comment && (
                        <p className="text-sm leading-relaxed mt-2 text-foreground">{comment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
        {/* Previous essays */}
        {essays && essays.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-heading mb-3">Redações anteriores</h3>
            <div className="rounded-lg border divide-y bg-card">
              {(analysis ? essays.filter((e) => e.id !== analysis.id) : essays).map((e) => {
                const date = new Date(e.created_at);
                const preview = e.input_text.slice(0, 160) + (e.input_text.length > 160 ? "…" : "");
                return (
                  <div key={e.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-sm mt-1 truncate max-w-[60ch]" title={e.input_text}>{preview}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="secondary" className="text-sm font-semibold px-2.5 py-0.5">{e.nota_total}</Badge>
                      {renderStars(Math.min(5, e.stars))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
