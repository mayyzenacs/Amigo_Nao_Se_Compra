using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<OngSubmission> OngSubmissions => Set<OngSubmission>();
}