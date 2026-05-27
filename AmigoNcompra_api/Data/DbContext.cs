using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    {
        Database.OpenConnection();
        Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }

    public DbSet<Ong> Ongs => Set<Ong>(); 
    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<CityReference> Cities => Set<CityReference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ong>(entity =>
        {
            entity.HasIndex(o => o.Name).IsUnique();
            entity.HasIndex(o => o.Website).IsUnique();
            entity.HasIndex(o => o.Contact).IsUnique();

            entity.HasIndex(o => o.NormalizedCity);
            entity.Property(o => o.City)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(o => o.NormalizedCity)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(o => o.Photo)
                .HasMaxLength(500); 
        });

        modelBuilder.Entity<Pet>(entity =>
        {
            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(p => p.Photo)
                .IsUnique();
            entity.Property(p => p.Photo)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<CityReference>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.NormalizedName); 
        });

        base.OnModelCreating(modelBuilder);
    }
}
