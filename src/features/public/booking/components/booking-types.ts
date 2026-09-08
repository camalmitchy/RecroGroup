export type Step = "service" | "time" | "intake" | "pay" | "done";

export type ServiceOption = {
    key: string;
    title: string;
    duration: string;
    icon: string;
    price: number;
};

export type PaymentMethod = "mpesa" | "card" | "bank";
