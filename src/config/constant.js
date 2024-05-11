const UserStatus = Object.freeze({
    ENABLED: 'enabled',
    DISABLED: 'disabled',
});

const CustomerStatus = Object.freeze({
    PENDING: 'pending',
    VERIFIED: 'verified',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    INACTIVE: 'inactive',
});

const LaminationType = Object.freeze({
    MYAT: 'myat',
    LOSS: 'loss',
    NO: 'no',
});

const MachineType = Object.freeze({
    COLORFUL_20_30: '20*30 Colorful',
    BW_20_30: '20*30 BW',
    BW_19_25: '19*25 BW',
    BW_10_15: '10*15 BW',
});

const PaymentType = Object.freeze({
    PAID: 'paid',
    DUE: 'due',
    BADDEBT: 'bad-debt',
});

const OrderStatus = Object.freeze({
    NEW_ORDER: 'newOrder',
    IN_PROGRESS: 'inProgress',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELED: 'canceled',
});

module.exports = {
    UserStatus,
    CustomerStatus,
    LaminationType,
    MachineType,
    PaymentType,
    OrderStatus,
};
