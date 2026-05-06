using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    {
        Database.EnsureCreated();
        Database.OpenConnection();
        Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }

    public DbSet<Ong> Ong => Set<Ong>();
    public DbSet<Pet> Pets => Set<Pet>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ong>()
            .HasIndex(o => o.City);
            
        base.OnModelCreating(modelBuilder);
    }
}