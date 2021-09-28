const { inspect } = require("util");
const { isValidURL } = require("../util");

module.exports = {
    name: "eval",
    aliases: ["e"],
    exec: async (msg, args) => {

        if(!["592707660604899328"].includes(msg.author.id)) {
            return msg.channel.send(`You ain't the owner lol :)`);
        }

        const isAsync = args.includes("--async");
        const isSilent = args.includes("--silent");
        const code = args.filter(e => !/^--(async|silent)$/.test(e)).join(" ");
        try {
            let result = eval(isAsync ? `(async()=>{${code}})()` : code);
            let isResultPromise = false;
            if (result instanceof Promise) {
                result = await result;
                isResultPromise = true;
            }
            if (isSilent) return;
            let inspectedResult = inspect(result, { depth: 0 });
            if (isResultPromise) inspectedResult = `Promise<${inspectedResult}>`;
            await msg.channel.send(`${isValidURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}`).catch((e) => console.log(e.stack));
        } catch (e) {
            msg.channel.send(`\`\`\`js\n${e}\`\`\``).catch((e) => console.log(e.stack));
        }
    }
};
