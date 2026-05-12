using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmigoNcompra_api.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Pets_Photo",
                table: "Pets",
                column: "Photo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ongs_NormalizedCity",
                table: "Ongs",
                column: "NormalizedCity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pets_Photo",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Ongs_NormalizedCity",
                table: "Ongs");
        }
    }
}
