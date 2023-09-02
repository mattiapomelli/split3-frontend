/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface SplitWiseGroupInterface extends utils.Interface {
  functions: {
    "activeMembers(uint256)": FunctionFragment;
    "addToWhitelist(address[])": FunctionFragment;
    "getActiveMember(uint256)": FunctionFragment;
    "getActiveMembersCount()": FunctionFragment;
    "isMember(address)": FunctionFragment;
    "isSettled()": FunctionFragment;
    "isWhitelisted(address)": FunctionFragment;
    "join()": FunctionFragment;
    "members(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeFromWhitelist(address[])": FunctionFragment;
    "removeMember(address)": FunctionFragment;
    "requiredAmount()": FunctionFragment;
    "send(uint256,address)": FunctionFragment;
    "settleGroup()": FunctionFragment;
    "stakes(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "activeMembers"
      | "addToWhitelist"
      | "getActiveMember"
      | "getActiveMembersCount"
      | "isMember"
      | "isSettled"
      | "isWhitelisted"
      | "join"
      | "members"
      | "owner"
      | "removeFromWhitelist"
      | "removeMember"
      | "requiredAmount"
      | "send"
      | "settleGroup"
      | "stakes",
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "activeMembers",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "addToWhitelist",
    values: [PromiseOrValue<string>[]],
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveMember",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveMembersCount",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "isMember",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: "isSettled", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isWhitelisted",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: "join", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "members",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeFromWhitelist",
    values: [PromiseOrValue<string>[]],
  ): string;
  encodeFunctionData(
    functionFragment: "removeMember",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "requiredAmount",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "send",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "settleGroup",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "stakes",
    values: [PromiseOrValue<string>],
  ): string;

  decodeFunctionResult(
    functionFragment: "activeMembers",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "addToWhitelist",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getActiveMember",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getActiveMembersCount",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "isMember", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isSettled", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelisted",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "join", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "members", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeFromWhitelist",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeMember",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "requiredAmount",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "settleGroup",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "stakes", data: BytesLike): Result;

  events: {};
}

export interface SplitWiseGroup extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SplitWiseGroupInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    activeMembers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>;

    addToWhitelist(
      newMembers: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    getActiveMember(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>;

    getActiveMembersCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    isMember(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;

    isSettled(overrides?: CallOverrides): Promise<[boolean]>;

    isWhitelisted(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;

    join(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    members(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeFromWhitelist(
      membersToRemove: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    removeMember(
      memberToRemove: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    requiredAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    send(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    settleGroup(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    stakes(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
  };

  activeMembers(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  addToWhitelist(
    newMembers: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  getActiveMember(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  getActiveMembersCount(overrides?: CallOverrides): Promise<BigNumber>;

  isMember(
    member: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>;

  isSettled(overrides?: CallOverrides): Promise<boolean>;

  isWhitelisted(
    member: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>;

  join(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  members(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeFromWhitelist(
    membersToRemove: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  removeMember(
    memberToRemove: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  requiredAmount(overrides?: CallOverrides): Promise<BigNumber>;

  send(
    amount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  settleGroup(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  stakes(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  callStatic: {
    activeMembers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;

    addToWhitelist(
      newMembers: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    getActiveMember(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;

    getActiveMembersCount(overrides?: CallOverrides): Promise<BigNumber>;

    isMember(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>;

    isSettled(overrides?: CallOverrides): Promise<boolean>;

    isWhitelisted(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>;

    join(overrides?: CallOverrides): Promise<void>;

    members(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeFromWhitelist(
      membersToRemove: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    removeMember(
      memberToRemove: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    requiredAmount(overrides?: CallOverrides): Promise<BigNumber>;

    send(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    settleGroup(overrides?: CallOverrides): Promise<void>;

    stakes(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    activeMembers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    addToWhitelist(
      newMembers: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    getActiveMember(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getActiveMembersCount(overrides?: CallOverrides): Promise<BigNumber>;

    isMember(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    isSettled(overrides?: CallOverrides): Promise<BigNumber>;

    isWhitelisted(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    join(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    members(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeFromWhitelist(
      membersToRemove: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    removeMember(
      memberToRemove: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    requiredAmount(overrides?: CallOverrides): Promise<BigNumber>;

    send(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    settleGroup(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    stakes(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    activeMembers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    addToWhitelist(
      newMembers: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    getActiveMember(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getActiveMembersCount(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    isMember(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    isSettled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isWhitelisted(
      member: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    join(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    members(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeFromWhitelist(
      membersToRemove: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    removeMember(
      memberToRemove: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    requiredAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    send(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    settleGroup(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    stakes(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
