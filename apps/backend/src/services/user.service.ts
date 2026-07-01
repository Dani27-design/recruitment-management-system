import { UserRepository, type PublicUser } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  listManagers(): Promise<PublicUser[]> {
    return this.userRepository.findManagers();
  }
}
