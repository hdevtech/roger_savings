import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";

actor {
  type UserAccount = {
    id: Nat;
    userUsername: Text;
    userPassword: Text;
    userRole: Text;
    userTel: Text;
  };
  var userAccounts : [UserAccount] = [];
  var nextId: Nat = 1;

  public func addUserAccount(userUsername: Text, userPassword: Text, userRole: Text, userTel: Text) : async Text {
    let newUserAccount: UserAccount = {
      id = nextId;
      userUsername = userUsername;
      userPassword = userPassword;
      userRole = userRole;
      userTel = userTel
    };
    userAccounts := Array.append(userAccounts, [newUserAccount]);
    nextId := nextId + 1;
    return "User account added successfully!";
  };

  public func getUserAccount(id: Nat) : async ?UserAccount {
    Array.find<UserAccount>(userAccounts, func(account: UserAccount) : Bool {
      account.id == id
    });
  };
  
  public func updateUserAccount(id: Nat, userUsername: Text, userPassword: Text, userRole: Text, userTel: Text) : async Text {
    let updatedUserAccount: UserAccount = {
      id = id;
      userUsername = userUsername;
      userPassword = userPassword;
      userRole = userRole;
      userTel = userTel
    };
    userAccounts := Array.map<UserAccount, UserAccount>(userAccounts, func(account: UserAccount) : UserAccount {
      if (account.id == id) {
        updatedUserAccount
      } else {
        account
      }
    });
    return "User account updated successfully!";
  };

  public func deleteUserAccount(id: Nat) : async Text {
    userAccounts := Array.filter<UserAccount>(userAccounts, func(account: UserAccount) : Bool {
      account.id != id
    });
    return "User account deleted successfully!";
  };

  public func getUserAccounts() : async [UserAccount] {
    return userAccounts;
  };
}
