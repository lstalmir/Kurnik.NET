using System;
using System.Collections.Generic;
using System.Text;
using Kurnik.Areas.Identity.Data;
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
                .WithMany(lobby => lobby.UserParticipations)
                 .IsRequired();
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasOne(participation => participation.User)
                .WithMany(user => user.LobbyParticipations)
                .IsRequired();

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
                OwnerId = testUser.Id,
            };
            modelBuilder.Entity<User>().HasData(testUser);

            modelBuilder.Entity<Lobby>().HasData(testLobby);

            modelBuilder.Entity<UserParticipationInLobby>().HasData(testParticipation);
        }

        public DbSet<Lobby> Lobbies { get; set; }

        public DbSet<UserParticipationInLobby> UserParticipationInLobbies { get; set; }
    }
}
