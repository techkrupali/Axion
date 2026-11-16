import dns from "node:dns";

/**
 * Outgoing connections (leads sheet, email, database) try IPv4 addresses first.
 * On the server, IPv6 to some Google addresses connects and then hangs with no reply,
 * which made leads-sheet rows time out (16 Nov 2026); IPv4 answers in about 3 seconds.
 */
export function preferIpv4() {
  dns.setDefaultResultOrder("ipv4first");
}
