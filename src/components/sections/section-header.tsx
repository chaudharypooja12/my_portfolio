interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-14 text-center">
      <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        <span className="gradient-text">{title}</span>
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mx-auto mt-6 flex items-center justify-center gap-2">
        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-nebula-2" />
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-nebula-2 to-accent" />
        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-accent to-primary" />
      </div>
    </div>
  );
}
