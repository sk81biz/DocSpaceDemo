﻿global using System.ComponentModel.DataAnnotations;
global using System.ComponentModel.DataAnnotations.Schema;
global using System.Configuration;
global using System.Data;
global using System.Data.Common;
global using System.Diagnostics;
global using System.Reflection;
global using System.Security.Cryptography;
global using System.ServiceModel;
global using System.Text;
global using System.Text.RegularExpressions;
global using System.Xml;
global using System.Xml.Linq;
global using System.Xml.XPath;

global using Amazon;
global using Amazon.S3;
global using Amazon.S3.Model;
global using Amazon.S3.Transfer;

global using ASC.Api.Utils;
global using ASC.Common;
global using ASC.Common.Caching;
global using ASC.Common.Logging;
global using ASC.Common.Threading;
global using ASC.Common.Utils;
global using ASC.Core;
global using ASC.Core.Billing;
global using ASC.Core.Common.Configuration;
global using ASC.Core.Common.EF;
global using ASC.Core.Common.EF.Context;
global using ASC.Core.Common.EF.Model;
global using ASC.Core.Tenants;
global using ASC.Core.Users;
global using ASC.Data.Backup.Contracts;
global using ASC.Data.Backup.Core;
global using ASC.Data.Backup.EF.Context;
global using ASC.Data.Backup.EF.Model;
global using ASC.Data.Backup.Exceptions;
global using ASC.Data.Backup.Extensions;
global using ASC.Data.Backup.Services;
global using ASC.Data.Backup.Storage;
global using ASC.Data.Backup.Tasks;
global using ASC.Data.Backup.Tasks.Data;
global using ASC.Data.Backup.Tasks.Modules;
global using ASC.Data.Backup.Utils;
global using ASC.Data.Storage;
global using ASC.Data.Storage.Configuration;
global using ASC.Files.Core;
global using ASC.MessagingSystem.Core;
global using ASC.Notify.Cron;
global using ASC.Notify.Model;
global using ASC.Notify.Patterns;
global using ASC.Notify.Recipients;
global using ASC.Security.Cryptography;
global using ASC.Web.Core.PublicResources;
global using ASC.Web.Core.Users;
global using ASC.Web.Core.WhiteLabel;
global using ASC.Web.Studio.Core;
global using ASC.Web.Studio.Core.Backup;
global using ASC.Web.Studio.Core.Notify;
global using ASC.Web.Studio.Utility;

global using Autofac;

global using ICSharpCode.SharpZipLib.GZip;
global using ICSharpCode.SharpZipLib.Tar;

global using Microsoft.AspNetCore.Http;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Options;

global using MySql.Data.MySqlClient;

global using Newtonsoft.Json;
global using Newtonsoft.Json.Linq;
