import {
  Controller,
  Get,
  Res
} from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  root(@Res() res) {
    return res.send('<p>You have successfully logged in</p><br><a href="/auth/logout">Logout</a>')
  }
}
