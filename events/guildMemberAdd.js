module.exports = (bot, member) => {

    let userLogs = member.guild.channels.find(c => c.name === 'user_logs');

    // anthony#8577
    userLogs.send(`${member.user.tag} has joined **${member.guild}**!`);

};