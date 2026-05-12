using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmigoNcompra_api.Migrations
{
    /// <inheritdoc />
    public partial class AddCitiesIbgeV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "State",
                table: "Cities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Cities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
