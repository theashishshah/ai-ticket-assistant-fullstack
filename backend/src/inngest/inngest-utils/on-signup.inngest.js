import sendMail from "../../utils/mailer.util.js";
import inngest from "../client.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";

export const onUserSignUp = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const { email } = event.data;
            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({ email });
                if (!userObject) {
                    throw new NonRetriableError("User doesn't exist.");
                }

                return userObject;
            });

            await step.run("send-welcome-email", async () => {
                const subject = "Welcome to AI app";
                const signupMessage = `Hey there,
                \n\n
                Thanks for signing up. we're glad to have you onboard!
                `;
                await sendMail(user.email, subject, signupMessage);
            });

            return { success: true };
        } catch (error) {
            console.error(`❌ Error running signup steps(pipeline) ${error}`);
            return { success: false };
        }
    },
);
