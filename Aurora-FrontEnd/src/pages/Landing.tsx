import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import auroraLogo from "@/assets/aurora-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img src={auroraLogo} alt="Aurora" className="h-10" />
          <Button onClick={() => navigate("/auth")} variant="default">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img src={auroraLogo} alt="Aurora" className="h-48 md:h-64 animate-float" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Sua mentora de redação está aqui
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Aurora corrige suas redações com feedbacks claros, motivadores e detalhados.
            Como uma mentora atenta, ela quer te ver crescer e brilhar no ENEM.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 gradient-aurora"
          >
            Comece agora gratuitamente
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">Feedback Instantâneo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Envie sua redação e receba análise completa em segundos, com comentários
                detalhados sobre cada competência.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">5 Competências</h3>
              <p className="text-muted-foreground leading-relaxed">
                Avaliação detalhada em norma culta, repertório, coerência, coesão e proposta de
                intervenção.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">Melhoria Contínua</h3>
              <p className="text-muted-foreground leading-relaxed">
                Acompanhe sua evolução com notas detalhadas e sugestões práticas para melhorar em
                cada tentativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Sua redação está pronta para brilhar
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se aos estudantes que já estão melhorando suas notas com Aurora
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 gradient-aurora"
          >
            Começar agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Aurora. Sua mentora de redação com IA.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
