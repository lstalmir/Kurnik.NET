using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using Kurnik.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Source.Data;
using System;
using System.Collections.Generic;
using Xunit;

namespace Kurnik.Tests
{
    public class Utils
    {
        public static DbContextOptions<ApplicationDbContext> GetDbOptions(string dbname)
        {
            return new DbContextOptionsBuilder<ApplicationDbContext>()
               .UseInMemoryDatabase(databaseName: dbname)
               .UseLazyLoadingProxies()
               .Options;
        }
    }
    public class LobbyService_EditLobbyShould
    {
        [Fact]
        public void ThrowExceptionGivenIdOutOfRange()
        {
            //arrange
            var options = Utils.GetDbOptions("EditLobbyShould_ThrowExceptionGivenIdOutOfRange");
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, null);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.EditLobby(5, "SomeLobby", true));
            }
        }

        [Fact]
        public void UpdateDatabaseGivenExistingId()
        {
            //arrange
            var options = Utils.GetDbOptions("EditLobbyShould_UpdateDatabaseGivenExistingId");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby
                {
                    ID = 5,
                    Name = "Test",
                    Private = false
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var chatService = new Mock<IChatService>();
                var service = new LobbyService(context, null, null);
                service.EditLobby(5, "GoodName", true);
            }
            //assert
            using (var context = new ApplicationDbContext(options))
            {
                Assert.True(context.Lobbies.Find(5).Private);
                Assert.Equal("GoodName", context.Lobbies.Find(5).Name);
            }
        }
    }

    public class LobbyService_AddUserShould
    {
        [Fact]
        public void ThrowExceptionGivenLobbyIdOutOfRange()
        {
            //arrange
            var options = Utils.GetDbOptions("AddUserShould_ThrowExceptionGivenLobbyIdOutOfRange");
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, null);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.AddUser(5, "test_user"));
            }
        }

        [Fact]
        public void ThrowExceptionGivenUserIdOutOfRange()
        {
            //arrange
            var options = Utils.GetDbOptions("AddUserShould_ThrowExceptionGivenUserIdOutOfRange");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, null);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.AddUser(5, "unknown_user"));
            }
        }

        [Fact]
        public void ThrowExceptionWhenUserIsAlreadyInTheLobby()
        {
            //arrange
            var options = Utils.GetDbOptions("AddUserShould_ThrowExceptionWhenUserIsAlreadyInTheLobby");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var lobbyInvitationSenderService = new Mock<ILobbyInvitationSenderService>();
                var service = new LobbyService(context, null, null);
                Assert.Throws<InvalidOperationException>(() => service.AddUser(5, "test_user"));
            }
        }

        [Fact]
        public void SuccessWhenUserIsNotInTheLobby()
        {
            //arrange
            var options = Utils.GetDbOptions("AddUserShould_SuccessWhenUserIsNotInTheLobby");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var lobbyInvitationSenderService = new Mock<ILobbyInvitationSenderService>();
                var service = new LobbyService(context, null, null);
                service.AddUser(5, "test_user");
            }
            //assert
            using (var context = new ApplicationDbContext(options))
            {
                var participation = context.UserParticipationInLobbies.Find(new object[] { 5, "test_user" });
                Assert.NotNull(participation);
                Assert.True(context.Lobbies.Find(5).UserParticipations.Contains(participation));
                Assert.Equal(context.Users.Find("test_user").LobbyParticipation, participation);
            }
        }

    }

    public class LobbyService_RemoveUserShould
    {
        [Fact]
        public void ThrowExceptionWhenUserIsNotInTheLobby()
        {
            //arrange
            var options = Utils.GetDbOptions("RemoveUserShould_ThrowExceptionWhenUserIsNotInTheLobby");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var chatService = new Mock<IChatService>();
                var service = new LobbyService(context, null, chatService.Object);
                Assert.Throws<InvalidOperationException>(() => service.RemoveUser(5, "test_user"));
            }
        }

        [Fact]
        public void RemoveUserParticipationFromDatabase()
        {
            //arrange
            var options = Utils.GetDbOptions("RemoveUserShould_RemoveUserParticipationFromDatabase");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var chatService = new Mock<IChatService>();
                var service = new LobbyService(context, null, chatService.Object);
                service.RemoveUser(5, "test_user");
            }
            //assert
            using (var context = new ApplicationDbContext(options))
            {
                Assert.Null(context.UserParticipationInLobbies.Find(new object[] { 5, "test_user" }));
                Assert.Equal(0, context.Lobbies.Find(5).UserParticipations.Count);
                Assert.Null(context.Users.Find("test_user").LobbyParticipation);
            }
        }

        [Fact]
        public void RemoveUserConnectionsToHub()
        {
            //arrange
            var chatService = new Mock<IChatService>();
            var options = Utils.GetDbOptions("RemoveUserShould_RemoveUserConnectionsToHub");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user",
                    UserName = "TestUser"
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.RemoveUser(5, "test_user");
            }
            //assert
            chatService.Verify(cs => cs.RemoveConnectionsFromChat(
                It.IsAny<ICollection<string>>(),
                It.Is<string>(connectionId => connectionId == "5")));
            chatService.Verify(cs => cs.OnUserLeft(
                It.Is<string>(username => username == "TestUser"),
                It.Is<string>(chatId => chatId == "5")));
        }
    }

    public class LobbyService_InviteUserShould
    {
        [Fact]
        public void ThrowExceptionWhenUserIsAlreadyInTheLobby()
        {
            //arrange
            var options = Utils.GetDbOptions("InviteUserShould_ThrowExceptionWhenUserIsAlreadyInTheLobby");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var lobbyInvitationSenderService = new Mock<ILobbyInvitationSenderService>();
                var service = new LobbyService(context, lobbyInvitationSenderService.Object, null);
                Assert.Throws<InvalidOperationException>(() => service.InviteUser(5, "test_user"));
            }
        }

        [Fact]
        public void CallSenderServiceWithCorrectInvitationMessage()
        {
            //arrange
            var lobbyInvitationSenderService = new Mock<ILobbyInvitationSenderService>();
            var options = Utils.GetDbOptions("InviteUserShould_CallSenderServiceWithCorrectInvitationMessage");
            using (var context = new ApplicationDbContext(options))
            {
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5,
                    Name = "Lobby",
                    OwnerId = "lobby_owner"
                });
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.Users.Add(new User()
                {
                    Id = "lobby_owner",
                    UserName = "LobbyOwner"
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, lobbyInvitationSenderService.Object, null);
                service.InviteUser(5, "test_user");
            }
            //assert
            lobbyInvitationSenderService.Verify(mock =>
                    mock.SendInvitationToLobby(
                        It.Is<string>(recipientId => recipientId == "test_user"),
                        It.Is<LobbyInvitationMessage>(inv =>
                            inv.InvitingUserName == "LobbyOwner"
                            && inv.LobbyId == 5
                            && inv.LobbyName == "Lobby")));
        }
    }

    public class LobbyService_SaveUserConnectionShould
    {
        [Fact]
        public void ThrowExceptionWhenUserNotFound()
        {
            //assert
            var options = Utils.GetDbOptions("SaveUserConnectionShould_ThrowExceptionWhenUserNotFound");
            var chatService = new Mock<IChatService>();
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.SaveUserConnection("ghost_user", "connectionId"));
            }
        }

        [Fact]
        public void ThrowExceptionWhenUserDoesNotParticipateInAnyLobby()
        {
            //assert
            var options = Utils.GetDbOptions("SaveUserConnectionShould_ThrowExceptionWhenUserDoesNotParticipateInAnyLobby");
            var chatService = new Mock<IChatService>();
            using(var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User() {
                    Id = "test_user"
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                Assert.Throws<InvalidOperationException>(() => service.SaveUserConnection("test_user", "connectionId"));
            }
        }

        [Fact]
        public void AddConnectionWhenUserParticipatesInLobby()
        {
            //assert
            var options = Utils.GetDbOptions("SaveUserConnectionShould_AddConnectionWhenUserParticipatesInLobby");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby() {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.SaveUserConnection("test_user", "connectionId");
            }
            //assert
            using(var context = new ApplicationDbContext(options))
            {
                var connections = context.UserParticipationInLobbies.Find(new object[] { 5, "test_user" }).ConnectionIds;
                Assert.Equal(new HashSet<string> { "connectionId" }, connections);
                chatService.Verify(cs => cs.AddConnectionToChat(
                    It.Is<string>(connectionId => connectionId == "connectionId"),
                    It.Is<string>(chatId => chatId == "5")));
            }
        }

        [Fact]
        public void HandleUserJoinWhenAddedFirstConnection()
        {
            //assert
            var options = Utils.GetDbOptions("SaveUserConnectionShould_HandleUserJoinWhenAddedFirstConnection");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user",
                    UserName = "TestUser"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.SaveUserConnection("test_user", "connectionId");
            }
            //assert
                chatService.Verify(cs => cs.OnUserJoined(
                    It.Is<string>(username => username == "TestUser"),
                    It.Is<string>(chatId => chatId == "5")));
        }

        [Fact]
        public void DoNotHandleUserJoinWhenUserHadConnectionBefore()
        {
            //assert
            var options = Utils.GetDbOptions("SaveUserConnectionShould_DoNotHandleUserJoinWhenUserHadConnectionBefore");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5,
                    ConnectionIds = new HashSet<string> { "otherConnectionId" }
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.SaveUserConnection("test_user", "connectionId");
            }
            //assert
            chatService.Verify(cs => cs.OnUserJoined(It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }
    }

    public class LobbyService_RemoveUserConnectionShould
    {
        [Fact]
        public void ThrowExceptionWhenUserNotFound()
        {
            //assert
            var options = Utils.GetDbOptions("RemoveUserConnectionShould_ThrowExceptionWhenUserNotFound");
            var chatService = new Mock<IChatService>();
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.RemoveUserConnection("ghost_user", "connectionId"));
            }
        }

        [Fact]
        public void ThrowExceptionWhenUserDoesNotParticipateInAnyLobby()
        {
            //assert
            var options = Utils.GetDbOptions("RemoveUserConnectionShould_ThrowExceptionWhenUserDoesNotParticipateInAnyLobby");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }
            //act & assert
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                Assert.Throws<InvalidOperationException>(() => service.RemoveUserConnection("test_user", "connectionId"));
            }
        }

        [Fact]
        public void RemoveConnectionWhenUserParticipatesInLobby()
        {
            //assert
            var options = Utils.GetDbOptions("RemoveUserConnectionShould_RemoveConnectionWhenUserParticipatesInLobby");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5,
                    ConnectionIds = new HashSet<string> { "connectionId" }
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.RemoveUserConnection("test_user", "connectionId");
            }
            //assert
            using (var context = new ApplicationDbContext(options))
            {
                var connections = context.UserParticipationInLobbies.Find(new object[] { 5, "test_user" }).ConnectionIds;
                Assert.Equal(0, connections.Count);
                chatService.Verify(cs => cs.RemoveConnectionsFromChat(
                    It.IsAny<ICollection<string>>(),
                    It.Is<string>(chatId => chatId == "5")));
            }
        }

        [Fact]
        public void HandleUserLeftWhenRemovedLastConnection()
        {
            //assert
            var options = Utils.GetDbOptions("RemoveUserConnectionShould_HandleUserLeftWhenRemovedLastConnection");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user",
                    UserName = "TestUser"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5,
                    ConnectionIds = new HashSet<string> { "connectionId" }
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.RemoveUserConnection("test_user", "connectionId");
            }
            //assert
            chatService.Verify(cs => cs.OnUserLeft(
                It.Is<string>(username => username == "TestUser"),
                It.Is<string>(chatId => chatId == "5")));
        }

        [Fact]
        public void DoNotHandleUserLeftWhenUserHaveOtherConnections()
        {
            //assert
            var options = Utils.GetDbOptions("RemoveUserConnectionShould_DoNotHandleUserLeftWhenUserHaveOtherConnections");
            var chatService = new Mock<IChatService>();
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.Lobbies.Add(new Lobby()
                {
                    ID = 5
                });
                context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = 5,
                    ConnectionIds = new HashSet<string> { "otherConnectionId", "connectionId" }
                });
                context.SaveChanges();
            }
            //act
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context, null, chatService.Object);
                service.RemoveUserConnection("test_user", "connectionId");
            }
            //assert
            chatService.Verify(cs => cs.OnUserLeft(It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }
    }
}
