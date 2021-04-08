﻿// <auto-generated />
using System;
using ASC.Core.Common.EF.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace ASC.Core.Common.Migrations.Npgsql.NotifyDbContextNpgsql
{
    [DbContext(typeof(PostgreSqlNotifyDbContext))]
    [Migration("20200929101850_NotifyDbContextNpgsql")]
    partial class NotifyDbContextNpgsql
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("ASC.Core.Common.EF.Model.NotifyInfo", b =>
                {
                    b.Property<int>("NotifyId")
                        .HasColumnName("notify_id")
                        .HasColumnType("integer");

                    b.Property<int>("Attempts")
                        .HasColumnName("attempts")
                        .HasColumnType("integer");

                    b.Property<DateTime>("ModifyDate")
                        .HasColumnName("modify_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("Priority")
                        .HasColumnName("priority")
                        .HasColumnType("integer");

                    b.Property<int>("State")
                        .HasColumnName("state")
                        .HasColumnType("integer");

                    b.HasKey("NotifyId")
                        .HasName("notify_info_pkey");

                    b.HasIndex("State")
                        .HasName("state");

                    b.ToTable("notify_info","onlyoffice");
                });

            modelBuilder.Entity("ASC.Core.Common.EF.Model.NotifyQueue", b =>
                {
                    b.Property<int>("NotifyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("notify_id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Attachments")
                        .HasColumnName("attachments")
                        .HasColumnType("text");

                    b.Property<string>("Content")
                        .HasColumnName("content")
                        .HasColumnType("text");

                    b.Property<string>("ContentType")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("content_type")
                        .HasColumnType("character varying(64)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(64);

                    b.Property<DateTime>("CreationDate")
                        .HasColumnName("creation_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Reciever")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("reciever")
                        .HasColumnType("character varying(255)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(255);

                    b.Property<string>("ReplyTo")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("reply_to")
                        .HasColumnType("character varying(1024)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(1024);

                    b.Property<string>("Sender")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("sender")
                        .HasColumnType("character varying(255)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(255);

                    b.Property<string>("SenderType")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("sender_type")
                        .HasColumnType("character varying(64)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(64);

                    b.Property<string>("Subject")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("subject")
                        .HasColumnType("character varying(1024)")
                        .HasDefaultValueSql("NULL")
                        .HasMaxLength(1024);

                    b.Property<int>("TenantId")
                        .HasColumnName("tenant_id")
                        .HasColumnType("integer");

                    b.HasKey("NotifyId")
                        .HasName("notify_queue_pkey");

                    b.ToTable("notify_queue","onlyoffice");
                });
#pragma warning restore 612, 618
        }
    }
}