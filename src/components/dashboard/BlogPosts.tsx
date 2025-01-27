import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const BlogPosts = () => {
  const { toast } = useToast();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: posts, refetch } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um post.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("blog_posts").insert([
        {
          title,
          content,
          author_id: session.user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Post criado com sucesso!",
        description: "O seu post foi publicado.",
      });

      setTitle("");
      setContent("");
      setShowNewPostForm(false);
      refetch();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro ao criar o post. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Atualizações da Equipa</h2>
        <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
          <Pen className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </div>

      {showNewPostForm && (
        <Card className="p-4 bg-card text-card-foreground">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full p-2 rounded bg-background text-foreground border border-border"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conteúdo"
              className="w-full p-2 rounded bg-background text-foreground border border-border h-32"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewPostForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Publicar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id} className="p-4 bg-card text-card-foreground">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
            <div className="text-sm text-muted-foreground mt-2">
              {new Date(post.created_at).toLocaleDateString("pt-BR")}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};