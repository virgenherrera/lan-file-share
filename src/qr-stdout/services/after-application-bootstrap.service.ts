import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { networkInterfaces as getNetworkInterfaces } from 'os';
import * as qrCodeTerminal from 'qrcode-terminal';
import { EnvConfigService } from '../../core/services';

@Injectable()
export class AfterApplicationBootstrapService
  implements OnApplicationBootstrap
{
  private url: URL;
  private networkAddresses: string[];
  private messages: string[] = ['\n'];

  constructor(private envConfigService: EnvConfigService) {}

  onApplicationBootstrap() {
    this.waitToStdoutAddresses();
  }

  private async waitToStdoutAddresses() {
    this.setUrl();
    this.setNetworkAddresses();
    this.fillAddresses();
    this.fillQrCode();

    await this.sleep();

    const stdoutMessage = this.messages.join('\n');

    process.stdout.write(stdoutMessage);
  }

  private setUrl() {
    const { port } = this.envConfigService;

    this.url = new URL(`http://localhost:${port}`);
  }

  private setNetworkAddresses() {
    this.networkAddresses = [this.url.href];

    const networkInterfaces = getNetworkInterfaces();

    Object.keys(networkInterfaces).forEach(netKey => {
      networkInterfaces[netKey].forEach(networkInterface => {
        if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
          this.url.host = networkInterface.address;

          this.networkAddresses.push(this.url.href);
        }
      });
    });
  }

  private fillAddresses() {
    this.messages.push(`navigate to the following URLs to start sharing:`);

    this.networkAddresses.forEach(networkAddress => {
      this.messages.push(`* ${networkAddress}`);
    });
  }

  private fillQrCode() {
    const [, mainAddress] = this.networkAddresses;

    this.messages.push('\n', 'Or scan the following QR-code.');

    qrCodeTerminal.generate(mainAddress, { small: true }, qrCode =>
      this.messages.push(qrCode),
    );
  }

  private sleep(ms = 1e3) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
