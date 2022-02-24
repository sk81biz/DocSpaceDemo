/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/

namespace ASC.Web.Files.Helpers
{
    [Singletone]
    public class ThirdpartyConfigurationData
    {
        private readonly IConfiguration _configuration;
        private List<string> _thirdPartyProviders;
        public List<string> ThirdPartyProviders => _thirdPartyProviders ??= _configuration.GetSection("files:thirdparty:enable").Get<List<string>>() ?? new List<string>();
        public ThirdpartyConfigurationData(IConfiguration configuration)
        {
            _configuration = configuration;
        }
    }

    [Scope(Additional = typeof(BaseLoginProviderExtension))]
    public class ThirdpartyConfiguration
    {
        private readonly ThirdpartyConfigurationData _configuration;
        private readonly Lazy<BoxLoginProvider> _boxLoginProvider;
        private readonly Lazy<DropboxLoginProvider> _dropboxLoginProvider;
        private readonly Lazy<OneDriveLoginProvider> _oneDriveLoginProvider;
        private readonly Lazy<DocuSignLoginProvider> _docuSignLoginProvider;
        private readonly Lazy<GoogleLoginProvider> _googleLoginProvider;

        public ThirdpartyConfiguration(
            ThirdpartyConfigurationData configuration,
            ConsumerFactory consumerFactory)
        {
            _configuration = configuration;
            _boxLoginProvider = new Lazy<BoxLoginProvider>(() => consumerFactory.Get<BoxLoginProvider>());
            _dropboxLoginProvider = new Lazy<DropboxLoginProvider>(() => consumerFactory.Get<DropboxLoginProvider>());
            _oneDriveLoginProvider = new Lazy<OneDriveLoginProvider>(() => consumerFactory.Get<OneDriveLoginProvider>());
            _docuSignLoginProvider = new Lazy<DocuSignLoginProvider>(() => consumerFactory.Get<DocuSignLoginProvider>());
            _googleLoginProvider = new Lazy<GoogleLoginProvider>(() => consumerFactory.Get<GoogleLoginProvider>());
        }

        public List<string> ThirdPartyProviders => _configuration.ThirdPartyProviders;

        public bool SupportInclusion(IDaoFactory daoFactory)
        {
            var providerDao = daoFactory.ProviderDao;
            if (providerDao == null)
            {
                return false;
            }

            return SupportBoxInclusion || SupportDropboxInclusion || SupportDocuSignInclusion || SupportGoogleDriveInclusion || SupportOneDriveInclusion || SupportSharePointInclusion || SupportWebDavInclusion || SupportNextcloudInclusion || SupportOwncloudInclusion || SupportkDriveInclusion || SupportYandexInclusion;
        }

        public bool SupportBoxInclusion => ThirdPartyProviders.Exists(r => r == "box") && _boxLoginProvider.Value.IsEnabled;

        public bool SupportDropboxInclusion => ThirdPartyProviders.Exists(r => r == "dropboxv2") && _dropboxLoginProvider.Value.IsEnabled;

        public bool SupportOneDriveInclusion => ThirdPartyProviders.Exists(r => r == "onedrive") && _oneDriveLoginProvider.Value.IsEnabled;

        public bool SupportSharePointInclusion => ThirdPartyProviders.Exists(r => r == "sharepoint");

        public bool SupportWebDavInclusion => ThirdPartyProviders.Exists(r => r == "webdav");

        public bool SupportNextcloudInclusion => ThirdPartyProviders.Exists(r => r == "nextcloud");

        public bool SupportOwncloudInclusion => ThirdPartyProviders.Exists(r => r == "owncloud");

        public bool SupportkDriveInclusion => ThirdPartyProviders.Exists(r => r == "kdrive");

        public bool SupportYandexInclusion => ThirdPartyProviders.Exists(r => r == "yandex");

        public string DropboxAppKey => _dropboxLoginProvider.Value["dropboxappkey"];

        public string DropboxAppSecret => _dropboxLoginProvider.Value["dropboxappsecret"];

        public bool SupportDocuSignInclusion => ThirdPartyProviders.Exists(r => r == "docusign") && _docuSignLoginProvider.Value.IsEnabled;

        public bool SupportGoogleDriveInclusion => ThirdPartyProviders.Exists(r => r == "google") && _googleLoginProvider.Value.IsEnabled;

        public List<List<string>> GetProviders()
        {
            var result = new List<List<string>>();

            if (SupportBoxInclusion)
            {
                result.Add(new List<string> { "Box", _boxLoginProvider.Value.ClientID, _boxLoginProvider.Value.RedirectUri });
            }

            if (SupportDropboxInclusion)
            {
                result.Add(new List<string> { "DropboxV2", _dropboxLoginProvider.Value.ClientID, _dropboxLoginProvider.Value.RedirectUri });
            }

            if (SupportGoogleDriveInclusion)
            {
                result.Add(new List<string> { "GoogleDrive", _googleLoginProvider.Value.ClientID, _googleLoginProvider.Value.RedirectUri });
            }

            if (SupportOneDriveInclusion)
            {
                result.Add(new List<string> { "OneDrive", _oneDriveLoginProvider.Value.ClientID, _oneDriveLoginProvider.Value.RedirectUri });
            }

            if (SupportSharePointInclusion)
            {
                result.Add(new List<string> { "SharePoint" });
            }

            if (SupportkDriveInclusion)
            {
                result.Add(new List<string> { "kDrive" });
            }

            if (SupportYandexInclusion)
            {
                result.Add(new List<string> { "Yandex" });
            }

            if (SupportWebDavInclusion)
            {
                result.Add(new List<string> { "WebDav" });
            }

            //Obsolete BoxNet, DropBox, Google, SkyDrive,

            return result;
        }
    }
}