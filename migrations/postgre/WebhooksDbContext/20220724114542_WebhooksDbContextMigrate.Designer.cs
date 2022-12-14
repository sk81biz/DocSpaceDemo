// <auto-generated />
using System;
using ASC.Webhooks.Core.EF.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ASC.Migrations.PostgreSql.Migrations
{
    [DbContext(typeof(WebhooksDbContext))]
    [Migration("20220724114542_WebhooksDbContextMigrate")]
    partial class WebhooksDbContextMigrate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("ASC.Webhooks.Core.EF.Model.WebhooksConfig", b =>
                {
                    b.Property<int>("ConfigId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("config_id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("SecretKey")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("secret_key")
                        .HasDefaultValueSql("''");

                    b.Property<int>("TenantId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Uri")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("uri")
                        .HasDefaultValueSql("''");

                    b.HasKey("ConfigId")
                        .HasName("PRIMARY");

                    b.ToTable("webhooks_config", (string)null);
                });

            modelBuilder.Entity("ASC.Webhooks.Core.EF.Model.WebhooksLog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("ConfigId")
                        .HasColumnType("int")
                        .HasColumnName("config_id");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime")
                        .HasColumnName("creation_time");

                    b.Property<string>("Event")
                        .HasMaxLength(100)
                        .HasColumnType("varchar")
                        .HasColumnName("event");

                    b.Property<string>("RequestHeaders")
                        .HasColumnType("json")
                        .HasColumnName("request_headers");

                    b.Property<string>("RequestPayload")
                        .IsRequired()
                        .HasColumnType("json")
                        .HasColumnName("request_payload");

                    b.Property<string>("ResponseHeaders")
                        .HasColumnType("json")
                        .HasColumnName("response_headers");

                    b.Property<string>("ResponsePayload")
                        .HasColumnType("json")
                        .HasColumnName("response_payload");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar")
                        .HasColumnName("status");

                    b.Property<int>("TenantId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Uid")
                        .HasMaxLength(50)
                        .HasColumnType("varchar")
                        .HasColumnName("uid");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.ToTable("webhooks_logs", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
