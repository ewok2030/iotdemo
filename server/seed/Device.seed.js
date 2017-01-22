import Device from '../models/Device.model';

/* eslint-disable no-console */
export default function () {
  Device.count().exec((err, count) => {
    if (count > 0) {
      return;
    }
    console.log('Seeding Devices...');
    const device1 = new Device({ title: 'Device One', status: 'New', dateCreated: new Date(), tags: ['foo', 'bar', 'test'] });
    const device2 = new Device({ title: 'Device Two', status: 'Active', dateCreated: new Date() });
    const device3 = new Device({ title: 'Device Three', status: 'New', dateCreated: new Date() });

    Device.create([device1, device2, device3 ], (error) => {
      if (!error) {
        console.log('Device seeding complete!');
      } else {
        console.log(`Device seed error: ${error.message}`);
      }
    });
  });
}
