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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ong>()
            .HasIndex(o => o.City);

        modelBuilder.Entity<Ong>()
            .HasIndex(o => o.Name)
            .IsUnique();

        modelBuilder.Entity<Ong>()
            .HasIndex(o => o.Website)
            .IsUnique();

        modelBuilder.Entity<Ong>()
            .HasIndex(o => o.Contact)
            .IsUnique();

        modelBuilder.Entity<Ong>()
            .Property(o => o.Photo)
            .HasMaxLength(500);

        base.OnModelCreating(modelBuilder);
    }
}