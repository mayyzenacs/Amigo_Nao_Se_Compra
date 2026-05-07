using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmigoNcompra_api.Migrations
{
    /// <inheritdoc />
    public partial class AddNormalizedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ongs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NormalizedCity = table.Column<string>(type: "TEXT", nullable: false),
                    Website = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Contact = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Activities = table.Column<int>(type: "INTEGER", nullable: false),
                    About = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Photo = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ongs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Photo = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ongs_City",
                table: "Ongs",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Ongs_Contact",
                table: "Ongs",
                column: "Contact",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ongs_Name",
                table: "Ongs",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ongs_Website",
                table: "Ongs",
                column: "Website",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ongs");

            migrationBuilder.DropTable(
                name: "Pets");
        }
    }
}
