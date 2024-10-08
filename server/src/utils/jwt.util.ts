import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/common/interfaces';

const parseJWT = (token: string): JWTPayload => {
  const jwt = token.split('Bearer ')[1] ?? '';
  const payload: JWTPayload = new JwtService().decode(jwt);

  return payload;
};

export { parseJWT };
