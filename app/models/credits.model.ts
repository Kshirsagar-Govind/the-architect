import mongoose, { Document, Schema, Model } from "mongoose";

interface ICreditAction extends Document {
    statement: string;
    amount: number;
    date: Date;
}

export interface ICredits extends Document {
    clientId: mongoose.Types.ObjectId;
    balance: number;
    history: ICreditAction[];
    deductCredits(amount: number, statement: string): Promise<void>;
    addCredits(amount: number): Promise<void>;
}

const CreditActionSchema = new Schema<ICreditAction>({
    statement: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const CreditsSchema: Schema<ICredits> = new Schema<ICredits>(
    {
        clientId: {
            type: Schema.Types.ObjectId,
            ref: "Clients",
            required: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        history: {
            type: [CreditActionSchema],
            default: [],
        },
    },
    { timestamps: true }
);

CreditsSchema.methods.deductCredits = async function (
    amount: number,
    statement: string
) {
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    if (this.balance < amount) throw new Error("Insufficient credits.");

    this.balance -= amount;

    this.history.push({
        statement,
        amount,
        date: new Date(),
    });

    // await this.save();
};

CreditsSchema.methods.addCredits = async function (
    amount: number,
    statement: string
) {
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    this.balance += amount;
    this.history.push({
        statement,
        amount,
        date: new Date(),
    });
    // await this.save();
};

const CreditsModel: Model<ICredits> = 
mongoose.model<ICredits>("Credits", CreditsSchema);
export default CreditsModel;
