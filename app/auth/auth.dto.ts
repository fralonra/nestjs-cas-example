export class UserDto {
  readonly user: String;
  readonly st: String;
}

export class SessionDto {
  readonly sid: String;
  readonly user: UserDto;
  readonly loggedInTime: Date;
}
