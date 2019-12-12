module.exports = async (bot, messageReaction, user) => {

    const message = messageReaction.message;

    const verifyChannel = message.guild.channels.find(c => c.id === '650795326298521640');
    const member = message.guild.members.get(user.id);
    if (member.user.bot) return;

    const verify = message.guild.roles.get('619257593617055766'); // Verified

    // Verify a member once they have reacted to the message in the verify channel (gives them the Verified role)
    if (messageReaction.emoji.name === '✅' && message.channel.id === verifyChannel.id) {
        member.removeRole(verify).catch(console.error);
        return messageReaction.remove(member).catch(console.error);
    }
};