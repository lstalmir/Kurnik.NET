using System;
using System.Collections.Generic;
using System.Text;
using Kurnik.Areas.Identity.Data;
using Kurnik.Data;
using Kurnik.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Source.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasKey(participation => new { participation.LobbyID, participation.UserID });
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasOne(participation => participation.Lobby)
                .WithMany(lobby => lobby.UserParticipations);
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasOne(participation => participation.User)
                .WithOne(user => user.LobbyParticipation)
                .HasForeignKey<UserParticipationInLobby>(participation => participation.UserID);

            // hub connections of the user are hold in db as a string
            var converter = new ConnectionIdsConverter();
            modelBuilder.Entity<UserParticipationInLobby>()
                .Property(p => p.ConnectionIds)
                .HasConversion(
                    connectionIds => converter.ToDbColumn(connectionIds),
                    connectionIdsStrings => converter.ToEntityAttribute(connectionIdsStrings)
                );

            var testUser = new User()
            {
                Id = "testuserid",
                Email = "test@test.pl",
                UserName = "test"
            };
            var testParticipation = new UserParticipationInLobby()
            {
                LobbyID = 5,
                UserID = testUser.Id
            };
            var testLobby = new Lobby()
            {
                ID = 5,
                Name = "POKÓJ TESTOWY",
                Private = false,
                OwnerID = testUser.Id,
            };
            modelBuilder.Entity<User>().HasData(testUser);

            modelBuilder.Entity<Lobby>().HasData(testLobby);

            modelBuilder.Entity<UserParticipationInLobby>().HasData(testParticipation);
        }

        public DbSet<Lobby> Lobbies { get; set; }

        public DbSet<UserParticipationInLobby> UserParticipationInLobbies { get; set; }
    }
}
