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

namespace ASC.Files.Core.Services.NotifyService
{
    public static class NotifyConstants
    {
        #region Events

        public static readonly INotifyAction EventDocuSignComplete = new NotifyAction("DocuSignComplete", "docusign complete");
        public static readonly INotifyAction EventDocuSignStatus = new NotifyAction("DocuSignStatus", "docusign status");
        public static readonly INotifyAction EventMailMergeEnd = new NotifyAction("MailMergeEnd", "mail merge end");
        public static readonly INotifyAction EventShareDocument = new NotifyAction("ShareDocument", "share document");
        public static readonly INotifyAction EventShareEncryptedDocument = new NotifyAction("ShareEncryptedDocument", "share encrypted document");
        public static readonly INotifyAction EventShareFolder = new NotifyAction("ShareFolder", "share folder");
        public static readonly INotifyAction EventEditorMentions = new NotifyAction("EditorMentions", "editor mentions");

        #endregion

        #region  Tags

        public static readonly string TagFolderID = "FolderID";
        public static readonly string TagDocumentTitle = "DocumentTitle";
        public static readonly string TagDocumentUrl = "DocumentURL";
        public static readonly string TagAccessRights = "AccessRights";
        public static readonly string TagMessage = "Message";
        public static readonly string TagMailsCount = "MailsCount";

        #endregion
    }
}