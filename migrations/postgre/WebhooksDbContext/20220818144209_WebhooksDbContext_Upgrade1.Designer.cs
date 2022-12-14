// <auto-generated />
using System;
using ASC.Webhooks.Core.EF.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ASC.Migrations.PostgreSql.Migrations.WebhooksDb
{
    [DbContext(typeof(WebhooksDbContext))]
    [Migration("20220818144209_WebhooksDbContext_Upgrade1")]
    partial class WebhooksDbContext_Upgrade1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("ASC.Webhooks.Core.EF.Model.WebhooksConfig", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<bool>("Enabled")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasColumnName("enabled")
                        .HasDefaultValueSql("true");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("name");

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

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex("TenantId")
                        .HasDatabaseName("tenant_id");

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

                    b.Property<DateTime?>("Delivery")
                        .HasColumnType("datetime")
                        .HasColumnName("delivery");

                    b.Property<string>("Method")
                        .HasMaxLength(100)
                        .HasColumnType("varchar")
                        .HasColumnName("method");

                    b.Property<string>("RequestHeaders")
                        .HasColumnType("json")
                        .HasColumnName("request_headers");

                    b.Property<string>("RequestPayload")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("request_payload");

                    b.Property<string>("ResponseHeaders")
                        .HasColumnType("json")
                        .HasColumnName("response_headers");

                    b.Property<string>("ResponsePayload")
                        .HasColumnType("text")
                        .HasColumnName("response_payload");

                    b.Property<string>("Route")
                        .HasMaxLength(100)
                        .HasColumnType("varchar")
                        .HasColumnName("route");

                    b.Property<int>("Status")
                        .HasColumnType("int")
                        .HasColumnName("status");

                    b.Property<int>("TenantId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Uid")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar")
                        .HasColumnName("uid");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex("ConfigId");

                    b.HasIndex("TenantId")
                        .HasDatabaseName("tenant_id");

                    b.ToTable("webhooks_logs", (string)null);
                });

            modelBuilder.Entity("ASC.Webhooks.Core.EF.Model.WebhooksLog", b =>
                {
                    b.HasOne("ASC.Webhooks.Core.EF.Model.WebhooksConfig", "Config")
                        .WithMany()
                        .HasForeignKey("ConfigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Config");
                });
#pragma warning restore 612, 618
        }
    }
}
