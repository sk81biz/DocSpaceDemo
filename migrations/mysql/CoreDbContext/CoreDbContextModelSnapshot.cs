// <auto-generated />
using System;
using ASC.Core.Common.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ASC.Migrations.MySql.Migrations
{
    [DbContext(typeof(CoreDbContext))]
    partial class CoreDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ASC.Core.Common.EF.DbButton", b =>
                {
                    b.Property<int>("TariffId")
                        .HasColumnType("int")
                        .HasColumnName("tariff_id");

                    b.Property<string>("PartnerId")
                        .HasColumnType("varchar(50)")
                        .HasColumnName("partner_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("ButtonUrl")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("button_url")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("TariffId", "PartnerId")
                        .HasName("PRIMARY");

                    b.ToTable("tenants_buttons", (string)null);

                    b.HasAnnotation("MySql:CharSet", "utf8");
                });

            modelBuilder.Entity("ASC.Core.Common.EF.DbQuota", b =>
                {
                    b.Property<int>("Tenant")
                        .HasColumnType("int")
                        .HasColumnName("tenant");

                    b.Property<int>("ActiveUsers")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("active_users")
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("AvangateId")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("avangate_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Description")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("description")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Features")
                        .HasColumnType("text")
                        .HasColumnName("features");

                    b.Property<long>("MaxFileSize")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("max_file_size")
                        .HasDefaultValueSql("'0'");

                    b.Property<long>("MaxTotalSize")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("max_total_size")
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("name")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<decimal>("Price")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("decimal(10,2)")
                        .HasColumnName("price")
                        .HasDefaultValueSql("'0.00'");

                    b.Property<bool>("Visible")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("visible")
                        .HasDefaultValueSql("'0'");

                    b.HasKey("Tenant")
                        .HasName("PRIMARY");

                    b.ToTable("tenants_quota", (string)null);

                    b.HasAnnotation("MySql:CharSet", "utf8");

                    b.HasData(
                        new
                        {
                            Tenant = -1,
                            ActiveUsers = 10000,
                            AvangateId = "0",
                            Features = "domain,audit,controlpanel,healthcheck,ldap,sso,whitelabel,branding,ssbranding,update,support,portals:10000,discencryption,privacyroom,restore",
                            MaxFileSize = 102400L,
                            MaxTotalSize = 10995116277760L,
                            Name = "default",
                            Price = 0.00m,
                            Visible = false
                        });
                });

            modelBuilder.Entity("ASC.Core.Common.EF.DbQuotaRow", b =>
                {
                    b.Property<int>("Tenant")
                        .HasColumnType("int")
                        .HasColumnName("tenant");

                    b.Property<string>("Path")
                        .HasColumnType("varchar(255)")
                        .HasColumnName("path")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<long>("Counter")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("counter")
                        .HasDefaultValueSql("'0'");

                    b.Property<DateTime>("LastModified")
                        .HasColumnType("timestamp")
                        .HasColumnName("last_modified");

                    b.Property<string>("Tag")
                        .HasColumnType("varchar(1024)")
                        .HasColumnName("tag")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("Tenant", "Path")
                        .HasName("PRIMARY");

                    b.HasIndex("LastModified")
                        .HasDatabaseName("last_modified");

                    b.ToTable("tenants_quotarow", (string)null);

                    b.HasAnnotation("MySql:CharSet", "utf8");
                });

            modelBuilder.Entity("ASC.Core.Common.EF.DbTariff", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("Comment")
                        .HasColumnType("varchar(255)")
                        .HasColumnName("comment")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("CreateOn")
                        .HasColumnType("timestamp")
                        .HasColumnName("create_on");

                    b.Property<int>("Quantity")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("quantity")
                        .HasDefaultValueSql("'1'");

                    b.Property<DateTime>("Stamp")
                        .HasColumnType("datetime")
                        .HasColumnName("stamp");

                    b.Property<int>("Tariff")
                        .HasColumnType("int")
                        .HasColumnName("tariff");

                    b.Property<int>("Tenant")
                        .HasColumnType("int")
                        .HasColumnName("tenant");

                    b.HasKey("Id");

                    b.HasIndex("Tenant")
                        .HasDatabaseName("tenant");

                    b.ToTable("tenants_tariff", (string)null);

                    b.HasAnnotation("MySql:CharSet", "utf8");
                });
#pragma warning restore 612, 618
        }
    }
}