import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const { data, isLoading } = useListBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Market Insights</h1>
        <p className="text-muted-foreground">Expert analysis, market updates, and educational resources for precious metals investors.</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Array.isArray(data) ? data : [])?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(201,168,76,0.15)]">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{post.category || 'News'}</div>
                  <h3 className="font-serif font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-auto pt-4 border-t border-border">
                    {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime} min read
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
