using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PcConfigurator.Migrations
{
    public partial class AddAdOwner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerUsername",
                table: "HardwareAds",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerUsername",
                table: "HardwareAds");
        }
    }
}
